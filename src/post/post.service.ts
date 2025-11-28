import { BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>
    ){}

    /**
     * Xử lý tạo bài đăng mới
     * @param userId 
     * @param createPostDto 
     * @returns PostEntity
     */
    async create(userId: number, createPostDto: CreatePostDto): Promise<Post>{
        const user = await this.userRepository.findOneBy({id: userId});
        if(!user){
            throw new BadRequestException('User not exists');
        }

        try{
            const res = await this.postRepository.save({
                ...createPostDto,
                user: user
            })
            const resPost = await this.postRepository.findOneBy({id: res.id});
            if(!resPost){
                throw new BadRequestException('Post not exists');
            }
            return resPost;
        }catch(err){
            throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Xử lý in ra tất cả các bài đăng
    */
   async findAll(query: FilterPostDto): Promise<any>{
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        const skip = (page - 1) * items_per_page;
        const[res, total] = await this.postRepository.findAndCount({
            where: [
                {title: Like('%' + search + '%')},
                {description: Like('%' + search + '%')}
            ],
            order: {create_at: 'DESC'},
            take: items_per_page,
            skip: skip,
            relations: {user: true},
            select: {
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true
                }
            }
        });
        const lastPage = Math.ceil(total/items_per_page);
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
    * Xử lý in bài đăng chi tiết
   */
  async findOne(id: number): Promise<Post>{
        const postDetail = await this.postRepository.findOne({
            where: {id},
            relations: {user: true},
            select: {
                user: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true
                }
            }
        });
        if(!postDetail){
            throw new HttpException('Post is not exist', HttpStatus.BAD_REQUEST);
        }
        return postDetail;
  }

  /**
   * Xử lý update post
  */
  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult>{
    return await this.postRepository.update(id, updatePostDto);
  }

  /**
   * Xử lý xóa bài đăng
  */
  async delete(id: number): Promise<DeleteResult>{
    return await this.postRepository.delete(id);
  }
}
