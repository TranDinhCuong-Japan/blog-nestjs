import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from '@nestjs/config';

/** 
 * Xác thực access token để dùng cho các private Api
*/
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService, private configService: ConfigService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }
        try{
            const playload = await this.jwtService.verifyAsync(token,{
                secret: this.configService.get<string>('JWT_SECRET')
            })
            request['user_data'] = playload;
        }catch(err){
            if(err.name === 'TokenExpiredError'){
                throw new UnauthorizedException('Expired token');
            }
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    /** 
     * Xử lý lấy token được gửi lên từ request
    */
    private extractTokenFromHeader(request: Request): string|undefined{
        const[type, token] = request.headers.authorization? request.headers.authorization.split(' ') : [];
        if(type !== 'Bearer'){
            throw new UnauthorizedException('Invalid token type');
        }
        return token;
    }
}