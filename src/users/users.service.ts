import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import NotfoundException from '../exception/notfound.exception';
import * as bcrypt from 'bcryptjs';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { PaginateDto } from '../common/dto/paginate.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import EntityNotFoundException from '../exception/notfound.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: UploadFileService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }],
    });

    if (existingUser) {
      throw new DuplicateEntityException('user', 'email', createUserDto.email);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.save(user);

    return createdUser;
  }

  async findOneByEmail(email: string) {
    const user = this.userRepository.findOne({
      where: { email },
      relations: {
        progress: true,
      },
    });

    return user;
  }

  async findById(id: number) {
    const user = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.progress',
        'progress',
        'progress.isCurrentActive = true',
      )
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new EntityNotFoundException('user', 'id', id);
    }

    if (file) {
      updateUserDto.profile_image_url =
        await this.fileService.uploadFileToPublicBucket(file);
    }

    Object.assign(existingUser, updateUserDto);

    return this.userRepository.save(existingUser);
  }
}
