import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { uploadImageInterceptor } from 'src/common/upload-image.interceptor';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}

    /**
     * Tạo bài đăng mới
    */
    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(uploadImageInterceptor('thumbnail', 'posts', 1024*1024*5))
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File){
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        return this.postService.create(req['user_data'].id, {...createPostDto, thumbnail: file.destination+ '/' + file.filename});
    }

    /**
     * In ra tất cả các bài đăng
    */
    @Get()
    @UseGuards(AuthGuard)
    findAll(@Query() query: FilterPostDto){
        return this.postService.findAll(query);
    }

   /**
    * In ra một bài chi tiết
   */
   @Get(':id')
   @UseGuards(AuthGuard)
   findOne(@Param('id') id: string){
        return this.postService.findOne(Number(id));
   }

   /**
    * Update post
   */
   @Put(':id')
   @UseGuards(AuthGuard)
   @UseInterceptors(uploadImageInterceptor('thumbnail', 'posts', 1024*1024*5))
   updatePost(@Param('id') id: string, @Req() req: any,@Body() updatePostDto: UpdatePostDto, @UploadedFile() file: Express.Multer.File){
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(file){
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }
        return this.postService.updatePost(Number(id), updatePostDto);
   }

   /**
    * Xóa bài đăng
   */
   @Delete(':id')
   @UseGuards(AuthGuard)
   delete(@Param('id') id: string){
        return this.postService.delete(Number(id));
   }
}
