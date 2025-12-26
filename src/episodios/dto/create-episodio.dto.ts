import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateEpisodioDto {
  @IsString()
  titulo: string;

  @IsInt()
  @Min(1)
  duracion: number;

  @IsInt()
  @Min(1)
  numeroCapitulo: number;

  @IsNumber()
  serieId: number;
}