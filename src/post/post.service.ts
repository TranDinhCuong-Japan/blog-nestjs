import { BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>
    ){}

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
}
