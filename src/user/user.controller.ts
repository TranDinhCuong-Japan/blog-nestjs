import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { AuthGuard } from "src/auth/auth.guard";
import { UserUpdateDto } from "./dto/user-update.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { FilterUserDto } from "./dto/filter-user.dto";
import { uploadImageInterceptor } from "src/common/upload-image.interceptor";

@Controller('users')
export class UserController{
    constructor(private userService: UserService){}

    /**
     * Hiển thị toàn bộ danh sách user
    */
    @Get()
    @UseGuards(AuthGuard)
    findAll(@Query() fiterUserDto: FilterUserDto): Promise<any>{
        return this.userService.findAll(fiterUserDto);
    }

    /**
     * Hiển thị chi tiết user
    */
    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User>{
        return this.userService.findOne(Number(id));
    }

    /**
     * Tạo mới user
    */
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User>{
        return this.userService.create(createUserDto);
    }

    /**
     * Chỉnh sửa nội dung user
    */
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() userUpdateDto: UserUpdateDto){
        return this.userService.update(Number(id), userUpdateDto);
    }

    /**
     * Xóa một user theo id
    */
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string){
        return this.userService.delete(Number(id));
    }

    /**
     * Upload avatar for User
    */
   @Post('upload-avatar')
   @UseGuards(AuthGuard)
   @UseInterceptors(uploadImageInterceptor('avatar', 'avatars', 1024*1024*5))
   uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File){
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        return this.userService.updateAvatar(req.user_data.id, file.destination+ '/' + file.filename);
   }
}