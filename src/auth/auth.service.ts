import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { compare } from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async validateUser(login: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne({ login });
    if (user) {
      const isValidPass = await this.usersService.comparePass(pass, user.password);
      if (isValidPass) {
        return user;
      }
    } 
    return null;
  }
}
