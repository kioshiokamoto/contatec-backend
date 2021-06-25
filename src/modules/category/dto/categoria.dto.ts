import { IsOptional, IsString } from "class-validator";




export class CategoriaDTO {

    @IsString()
    cat_nombre: string;

    @IsOptional()
    @IsString()
    cat_descripcion: string;

}





