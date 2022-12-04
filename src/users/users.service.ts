import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { bcrypt } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await this.pass2Hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hash
    });
    return this.userRepository.save(user);
  }

  private async pass2Hash(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePass(pass, hash) {
    return await bcrypt.compare(pass, hash);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(query: { id?: number, login?: string }): Promise<User> {
    const user = await this.userRepository.findOneBy(query);
    if (user) {
      return user;
    }
    throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.delete(id);
    if (!user.affected) {
      throw new HttpException("user not found", HttpStatus.NOT_FOUND)
    }
    return { removed: true };
  }
}
