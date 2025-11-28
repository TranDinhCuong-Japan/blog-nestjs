import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { UpdateResult, DeleteResult } from "typeorm/browser";
import { UserUpdateDto } from "./dto/user-update.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt'
import { FilterUserDto } from "./dto/filter-user.dto";

@Injectable()
export class UserService{
    constructor(@InjectRepository(User) private repository: Repository<User> ){}

    /**
     * Xử lý hiển thị danh sách user
    */
    async findAll(query: FilterUserDto): Promise<any>{
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_page;
        const search = query.search || '';
        const[res, total] = await this.repository.findAndCount({
            where: [
                {firstName: Like('%' + search +'%')},
                {lastName: Like('%' + search +'%')},
                {email: Like('%' + search +'%')},
            ],
            order: {created_at: "DESC"},
            take: item_per_page,
            skip: skip,
            select: ['id', 'firstName', 'lastName', 'email', 'status', 'created_at', 'updated_at']
        })
        const lastPage = Math.ceil(total/item_per_page);
        const nextPage = page + 1 > lastPage? null : page +1;
        const prevPage = page - 1 < 1 ? null : page -1;

        return {
            data: res,
            total,
            curenPage: page,
            nextPage,
            prevPage,
            lastPage
        };
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
        const updateUser =  await this.repository.update(id, userUpdateDto);
        if(updateUser.affected !== 1){
            throw new HttpException('User not exits', HttpStatus.BAD_REQUEST);
        }
        return updateUser;
    }
    /**
     * Xử lý xóa user
    */
    async delete(id: number):Promise<DeleteResult>{
        const deleteUser = await this.repository.delete(id);
        if(deleteUser.affected !== 1){
            throw new HttpException('User not exits', HttpStatus.BAD_REQUEST);
        }
        return deleteUser;
    }

    /**
     * Xử lý upload ảnh lưu đường dẫn vào DB
    */
   async updateAvatar(id: number, avatar: string): Promise<UpdateResult>{
    return this.repository.update(id, {avatar});
   }
}