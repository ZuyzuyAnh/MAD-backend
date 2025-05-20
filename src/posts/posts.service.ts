import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { UploadFileService } from 'src/aws/uploadfile.s3.service';
import EntityNotFoundException from 'src/exception/notfound.exception';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: number,
    files?: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.uploadFileService.uploadFileToPublicBucket(file),
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const post = this.postRepository.create({
      ...createPostDto,
      userId,
      imageUrls,
    });

    const savedPost = await this.postRepository.save(post);

    // Lấy post với thông tin đầy đủ của user
    return this.postRepository.findOne({
      where: { id: savedPost.id },
      relations: ['user', 'language'],
    });
  }

  async findAll(
    paginateDto: PaginateDto,
    languageId?: number,
    title?: string,
    content?: string,
    tags?: string[],
  ) {
    const { page, limit } = paginateDto;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.user', 'user');

    if (languageId) {
      query.andWhere('post.languageId = :languageId', { languageId });
    }

    if (title) {
      query.andWhere('post.title LIKE :title', { title: `%${title}%` });
    }

    if (content) {
      query.andWhere('post.content LIKE :content', { content: `%${content}%` });
    }

    if (tags && tags.length > 0) {
      // Tìm bài viết có chứa ít nhất một tag trong danh sách
      const tagConditions = tags.map((tag, index) => {
        query.orWhere(`post.tags LIKE :tag${index}`, {
          [`tag${index}`]: `%${tag}%`,
        });
        return `post.tags LIKE :tag${index}`;
      });
      query.andWhere(`(${tagConditions.join(' OR ')})`);
    }

    query.skip((page - 1) * limit).take(limit);
    query.orderBy('post.createdAt', 'DESC');

    const [posts, total] = await query.getManyAndCount();

    return {
      data: posts,
      meta: {
        totalItems: total,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'likes', 'comments.user'],
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    files?: Express.Multer.File[],
  ) {
    const post = await this.findOne(id);

    if (!post) {
      throw new EntityNotFoundException('post', 'id', id);
    }

    // Xử lý yêu cầu xóa hình ảnh nếu có
    if (updatePostDto.imagesToRemove) {
      let imagesToRemove: string[] = [];

      // Chuyển đổi sang mảng nếu là chuỗi
      if (typeof updatePostDto.imagesToRemove === 'string') {
        imagesToRemove = updatePostDto.imagesToRemove.split(',');
      } else if (Array.isArray(updatePostDto.imagesToRemove)) {
        imagesToRemove = updatePostDto.imagesToRemove;
      }

      // Lọc bỏ các URL ảnh cần xóa
      if (
        imagesToRemove.length > 0 &&
        post.imageUrls &&
        post.imageUrls.length > 0
      ) {
        post.imageUrls = post.imageUrls.filter(
          (url) => !imagesToRemove.includes(url),
        );
      }
    }

    // Thêm ảnh mới nếu có
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.uploadFileService.uploadFileToPublicBucket(file),
      );
      const newImageUrls = await Promise.all(uploadPromises);

      post.imageUrls = [...(post.imageUrls || []), ...newImageUrls];
    }

    // Cập nhật dữ liệu
    if (updatePostDto.title) post.title = updatePostDto.title;
    if (updatePostDto.content) post.content = updatePostDto.content;

    // Xử lý tags: nếu là chuỗi thì chuyển thành mảng, nếu là mảng thì giữ nguyên
    if (updatePostDto.tags) {
      if (typeof updatePostDto.tags === 'string') {
        post.tags = updatePostDto.tags.split(',');
      } else {
        post.tags = updatePostDto.tags;
      }
    }

    // Lưu bài viết đã cập nhật
    const updatedPost = await this.postRepository.save(post);

    // Trả về bài viết với quan hệ đầy đủ
    return this.postRepository.findOne({
      where: { id: updatedPost.id },
      relations: ['user', 'comments', 'likes', 'comments.user'],
    });
  }

  async removeImage(id: number, imageUrl: string) {
    const post = await this.findOne(id);

    if (!post) {
      throw new EntityNotFoundException('post', 'id', id);
    }

    if (post.imageUrls && post.imageUrls.includes(imageUrl)) {
      post.imageUrls = post.imageUrls.filter((url) => url !== imageUrl);
      await this.postRepository.save(post);
      return true;
    }

    return false;
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new EntityNotFoundException('post', 'id', id);
    }

    // Xóa tất cả likes liên quan đến bài viết trước
    await this.postRepository.manager.query(
      'DELETE FROM post_likes WHERE post_id = $1',
      [id],
    );

    // Xóa tất cả comments liên quan đến bài viết trước
    await this.postRepository.manager.query(
      'DELETE FROM post_comments WHERE post_id = $1',
      [id],
    );

    // Xóa tất cả reports liên quan đến bài viết nếu có
    await this.postRepository.manager.query(
      'DELETE FROM post_reports WHERE post_id = $1',
      [id],
    );

    // Sau đó xóa bài viết
    return this.postRepository.remove(post);
  }

  async findMyPosts(userId: number, paginateDto: PaginateDto) {
    const { page, limit } = paginateDto;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.language', 'language')
      .where('post.userId = :userId', { userId });

    query.skip((page - 1) * limit).take(limit);
    query.orderBy('post.createdAt', 'DESC');

    const [posts, total] = await query.getManyAndCount();

    return {
      data: posts,
      meta: {
        totalItems: total,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async getPopularPosts(limit: number = 10): Promise<Post[]> {
    // Lấy bài viết phổ biến dựa trên số lượt thích và bình luận
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.language', 'language')
      .addSelect('COUNT(DISTINCT likes.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
      .addSelect(
        '(COUNT(DISTINCT likes.id) + COUNT(DISTINCT comments.id))',
        'popularity',
      )
      .groupBy('post.id')
      .orderBy('popularity', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getTrendingPosts(
    days: number = 7,
    limit: number = 10,
  ): Promise<Post[]> {
    // Lấy bài viết xu hướng trong khoảng thời gian gần đây
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.language', 'language')
      .where('post.createdAt >= :date', { date })
      .addSelect('COUNT(DISTINCT likes.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
      .addSelect(
        '(COUNT(DISTINCT likes.id) + COUNT(DISTINCT comments.id))',
        'popularity',
      )
      .groupBy('post.id')
      .orderBy('popularity', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findByTag(tag: string, paginateDto: PaginateDto) {
    const { page, limit } = paginateDto;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.tags LIKE :tag', { tag: `%${tag}%` });

    query.skip((page - 1) * limit).take(limit);
    query.orderBy('post.createdAt', 'DESC');

    const [posts, total] = await query.getManyAndCount();

    return {
      data: posts,
      meta: {
        totalItems: total,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async getAllTags() {
    // Lấy tất cả các bài viết có tags
    const posts = await this.postRepository.find({
      select: ['tags'],
      where: {
        tags: Not(IsNull()),
      },
    });

    // Tạo một Set để lưu trữ các tags duy nhất
    const uniqueTags = new Set<string>();

    // Duyệt qua tất cả các bài viết và thêm tags vào Set
    posts.forEach((post) => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach((tag) => {
          uniqueTags.add(tag);
        });
      }
    });

    // Chuyển đổi Set thành mảng và sắp xếp theo bảng chữ cái
    return Array.from(uniqueTags).sort();
  }
}
