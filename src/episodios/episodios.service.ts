import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episodio } from './entities/episodio.entity';
import { Repository } from 'typeorm';
import { CreateEpisodioDto } from './dto/create-episodio.dto';
import { UpdateEpisodioDto } from './dto/update-episodio.dto';

@Injectable()
export class EpisodiosService {
  constructor(
    @InjectRepository(Episodio)
    private readonly episodioRepo: Repository<Episodio>,
  ) {}

  create(dto: CreateEpisodioDto) {
    const episodio = this.episodioRepo.create(dto);
    return this.episodioRepo.save(episodio);
  }

  findAll() {
    return this.episodioRepo.find({
      relations: ['serie'],
    });
  }

  async findOne(id: number) {
    const episodio = await this.episodioRepo.findOne({
      where: { id },
      relations: ['serie'],
    });
    if (!episodio) throw new NotFoundException('Episodio no encontrado');
    return episodio;
  }

  async update(id: number, dto: UpdateEpisodioDto) {
    const episodio = await this.findOne(id);
    Object.assign(episodio, dto);
    return this.episodioRepo.save(episodio);
  }

  async remove(id: number) {
    const episodio = await this.findOne(id);
    return this.episodioRepo.remove(episodio);
  }
}

