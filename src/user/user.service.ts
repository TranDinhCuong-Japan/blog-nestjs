import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateResult, DeleteResult } from "typeorm/browser";
import { UserUpdateDto } from "./dto/user-update.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService{
    constructor(@InjectRepository(User) private repository: Repository<User> ){}

    /**
     * Xử lý hiển thị danh sách user
    */
    async findAll(): Promise<User[]>{
        return await this.repository.find({
            select: ['id', 'firstName', 'lastName', 'email', 'status', 'created_at', 'updated_at']
        })
    }

    /**
     * Xử lý hiển thị chi tiết user
    */
    async findOne(id: number): Promise<User> {
        const findUserDetail = await this.repository.findOneBy({id});
        if(!findUserDetail){
            throw new HttpException('User not exits', HttpStatus.BAD_REQUEST);
        }

        return findUserDetail;
    }

    /**
     * Xử lý tạo mới user
    */
    async create(createUserDto: CreateUserDto): Promise<User>{
        const hashPass = await bcrypt.hash(createUserDto.password, 10);
        return this.repository.save({...createUserDto, password: hashPass});
    }

    /**
     * Xử lý sửa nội dung user
    */
    async update(id: number, userUpdateDto: UserUpdateDto):Promise<UpdateResult>{
        return await this.repository.update(id, userUpdateDto);
    }
    /**
     * Xử lý xóa user
    */
    async delete(id: number):Promise<DeleteResult>{
        return await this.repository.delete(id);
    }
}