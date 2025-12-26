import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Serie } from './entities/serie.entity';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Serie)
    private readonly serieRepo: Repository<Serie>,
  ) {}

  create(dto: CreateSerieDto) {
    const serie = this.serieRepo.create(dto);
    return this.serieRepo.save(serie);
  }

  findAll() {
    return this.serieRepo.find({
      relations: ['episodios'],
    });
  }

  async findOne(id: number) {
    const serie = await this.serieRepo.findOne({
      where: { id },
      relations: ['episodios'],
    });
    if (!serie) throw new NotFoundException('Serie no encontrada');
    return serie;
  }

  async update(id: number, dto: UpdateSerieDto) {
    const serie = await this.findOne(id);
    Object.assign(serie, dto);
    return this.serieRepo.save(serie);
  }

  async remove(id: number) {
    const serie = await this.findOne(id);
    return this.serieRepo.remove(serie);
  }
}