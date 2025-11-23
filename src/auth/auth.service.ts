import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; 
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    /*
     *Xử lý đăng ký
    */
    async register(registerUserDto: RegisterUserDto):Promise<User>{
        const hashPass = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({...registerUserDto, refresh_token:"refresh_token", password: hashPass});
    }

    /*
     *Xử lý Đăng nhập
    */
   async login(LoginUserDto: LoginUserDto): Promise<any>{
        const user = await this.userRepository.findOne({
            where: {email: LoginUserDto.email}
        });

        if(!user){
            throw new HttpException("Email is not exits", HttpStatus.UNAUTHORIZED);
        }

        const checkPass = bcrypt.compareSync(LoginUserDto.password, user.password);
        if(!checkPass){
            throw new HttpException("Pass is not correct", HttpStatus.UNAUTHORIZED);
        }

        // Tạo token
        const playload = {id: user.id, email: user.email};
        
        return this.generateToken(playload);
   }

      /*
    *Xử lý tạo mới token sau mỗi lần đăng nhập
   */
   async refreshToken(refreshToken: string): Promise<any>{
    try {
        const verifyToken = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('JWT_SECRET')
        });

        const checkRefreshToken = await this.userRepository.findOneBy({email: verifyToken.email, refresh_token: refreshToken});
        if(checkRefreshToken){
            return this.generateToken({id: verifyToken.id, email: verifyToken.email});
        }else{
            throw new HttpException("Check refresh token not passed", HttpStatus.BAD_REQUEST);
        }

    } catch (error) {
        throw new HttpException("Refresh token is not valid", HttpStatus.BAD_REQUEST);
    }
   }

    /*
     *Tạo refresh token va access token
    */
    private async generateToken(playload: {id: number, email: string}){
        const accessToken = await this.jwtService.signAsync(playload);
        const refreshToken = await this.jwtService.signAsync(playload,{
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRESIN_1D') as any,
        });
        await this.userRepository.update(
            {email: playload.email},
            {refresh_token: refreshToken}
        );

        return {accessToken, refreshToken};
   }

    /*
     *Xử lý mã hóa mật khẩu
    */
    private async hashPassword(password: string): Promise<string>{
        const saltRound: number = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}
