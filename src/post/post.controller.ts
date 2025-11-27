import { BadRequestException, Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { PostService } from './post.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail', {
            storage: storageConfig('posts'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                if(!allowedExtArr.includes(ext)){
                    req.fileValidationError = `Wrong axtension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                    cb(null, false);
                }else{
                    const fileSize = parseInt(req.headers['content-length']);
                    if(fileSize > 1024*1024*5){
                        req.fileValidationError = 'File size is too large. Accepted file size is less than 5Mb'
                        cb(null, false);
                    }else{
                        cb(null, true);
                    }
                }
            }
    
        }))
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File){
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        return this.postService.create(req['user_data'].id, {...createPostDto, thumbnail: file.destination+ '/' + file.filename});
    }
}
