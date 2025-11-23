import { Body, Controller, Post, ValidationPipe, UsePipes } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    /*
     *Đăng ký
    */
    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto):Promise<User>{
        return this.authService.register(registerUserDto);
    }

    /*
     *Đăng nhập 
    */
    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto: LoginUserDto): Promise<any>{
        return this.authService.login(loginUserDto);
    }

    /*
     *Làm mới token sau mỗi lần đăng nhập
    */
    @Post('refreshtoken')
    refreshToken(@Body() {refresh_token}): Promise<any>{
        return this.authService.refreshToken(refresh_token);
    }

}
