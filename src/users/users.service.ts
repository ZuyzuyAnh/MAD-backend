import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import NotfoundException from '../exception/notfound.exception';
import * as bcrypt from 'bcryptjs';
import { UploadFileService } from '../aws/uploadfile.s3.service';

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

    const imageUrl = await this.fileService.uploadFileToPublicBucket(file);

    user.profile_image_url = imageUrl;

    return this.userRepository.save(user);
  }
}
