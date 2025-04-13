import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordMatch = await this.isPasswordMatch(password, user.password);

    if (user && isPasswordMatch) {
      const { password: _, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: User) {
    const payload: TokenPayloadDto = { role: user.role, sub: user.id };

    return this.jwtService.sign(payload);
  }

  register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  private async isPasswordMatch(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
