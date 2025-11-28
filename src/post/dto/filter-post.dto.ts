import { IsNotEmpty } from "class-validator";

export class FilterPostDto{
    @IsNotEmpty()
    page: string;

    @IsNotEmpty()
    items_per_page: string;
    
    search: string;
}