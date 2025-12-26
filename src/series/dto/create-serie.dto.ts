import { IsString, IsUrl } from 'class-validator';

export class CreateSerieDto {
  @IsString()
  titulo: string;

  @IsString()
  genero: string;

  @IsString()
  sinopsis: string;

  @IsUrl()
  urlPortada: string;
}