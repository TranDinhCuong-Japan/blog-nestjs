import { FileInterceptor } from "@nestjs/platform-express";
import { storageConfig } from "helpers/config";
import { extname } from "path";

export function uploadImageInterceptor(fieldName: string, folder: string, fileSizeCus: number){
    return FileInterceptor(fieldName, {
            storage: storageConfig(folder),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                if(!allowedExtArr.includes(ext)){
                    req.fileValidationError = `Wrong axtension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                    cb(null, false);
                }else{
                    const fileSize = parseInt(req.headers['content-length']);
                    if(fileSize > fileSizeCus){
                        req.fileValidationError = `File size is too large. Accepted file size is less than ${fileSizeCus/(1024*1024)}Mb`
                        cb(null, false);
                    }else{
                        cb(null, true);
                    }
                }
            }
    
        })
}