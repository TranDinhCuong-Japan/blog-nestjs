import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async register(registerUserDto: RegisterUserDto):Promise<User>{
        const hashPass = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({...registerUserDto, refresh_token:"refresh_token", password: hashPass});
    }

    private async hashPassword(password: string): Promise<string>{
        const saltRound: number = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}
