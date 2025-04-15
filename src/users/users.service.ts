import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import * as bcrypt from 'bcryptjs';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { UpdateUserDto } from './dto/update-user.dto';
import EntityNotFoundException from '../exception/notfound.exception';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: UploadFileService,
    private progressService: ProgressService,
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

  async findAll(role?: UserRole) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    const users = await queryBuilder.getMany();

    return users;
  }

  async findOneByEmail(email: string) {
    const user = this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findById(id: number) {
    const user = this.userRepository.findOneBy({ id });

    return user;
  }

  async getUserProfile(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new EntityNotFoundException('user', 'id', id);
    }

    const progress = await this.progressService.getExerciseStatisticForUser(id);

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      progress,
    };
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
