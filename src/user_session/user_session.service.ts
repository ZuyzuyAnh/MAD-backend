import { Injectable } from '@nestjs/common';
import { CreateUserSessionDto } from './dto/create-user_session.dto';
import { UpdateUserSessionDto } from './dto/update-user_session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from './entities/user_session.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  create(createUserSessionDto: CreateUserSessionDto) {
    const userSession = this.userSessionRepository.create(createUserSessionDto);
    return this.userSessionRepository.save(userSession);
  }

  findAll() {
    return `This action returns all userSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSession`;
  }

  update(id: number, updateUserSessionDto: UpdateUserSessionDto) {
    return `This action updates a #${id} userSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSession`;
  }
}
