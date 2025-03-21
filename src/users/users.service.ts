import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import NotfoundException from '../exception/notfound.exception';
import * as bcrypt from 'bcryptjs';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { PaginateDto } from '../utils/dto/paginate.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: UploadFileService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new DuplicateEntityException(
          'user',
          'email',
          createUserDto.email,
        );
      }
      if (existingUser.username === createUserDto.username) {
        throw new DuplicateEntityException(
          'user',
          'username',
          createUserDto.username,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotfoundException('user', 'username', username);
    }

    return user;
  }

  async updateProfileImage(userId: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotfoundException('user', 'id', userId);
    }

    user.profile_image_url =
      await this.fileService.uploadFileToPublicBucket(file);

    return this.userRepository.save(user);
  }

  async findAll(
    paginateDto: PaginateDto,
    username?: string,
    email?: string,
    role?: UserRole,
  ) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (username) {
      queryBuilder.where('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    if (email) {
      if (username) {
        queryBuilder.andWhere('user.email LIKE :email', {
          email: `%${email}%`,
        });
      } else {
        queryBuilder.where('user.email LIKE :email', { email: `%${email}%` });
      }
    }

    if (role) {
      if (username || email) {
        queryBuilder.andWhere('user.role = :role', { role });
      } else {
        queryBuilder.where('user.role = :role', { role });
      }
    }

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.created_at', 'DESC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
