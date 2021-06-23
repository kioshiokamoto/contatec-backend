import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CrearPostDTO {
  @IsNumber()
  pst_idUsuario: number;

  @IsOptional()
  @IsBoolean()
  pst_isActive: boolean;

  @IsString()
  pst_descripcion: string;

  @IsOptional()
  @IsString()
  pst_imagen_1?: string;

  @IsOptional()
  @IsString()
  pst_imagen_2?: string;

  @IsOptional()
  @IsString()
  pst_imagen_3?: string;

  @IsOptional()
  @IsString()
  pst_imagen_4?: string;

  @IsOptional()
  @IsString()
  pst_imagen_5?: string;

  @IsNumber()
  pst_precioBase: number;
}
