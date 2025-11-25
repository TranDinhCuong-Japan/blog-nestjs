import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { AuthGuard } from "src/auth/auth.guard";
import { UserUpdateDto } from "./dto/user-update.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('users')
export class UserController{
    constructor(private userService: UserService){}

    /**
     * Hiển thị toàn bộ danh sách user
    */
    @Get()
    @UseGuards(AuthGuard)
    findAll(): Promise<User[]>{
        return this.userService.findAll();
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
}