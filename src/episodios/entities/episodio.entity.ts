import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Serie } from '../../series/entities/serie.entity';

@Entity('episodios')
export class Episodio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('int')
  duracion: number; // en minutos

  @Column('int')
  numeroCapitulo: number;

  @Column()
  serieId: number;

  @ManyToOne(() => Serie, (serie) => serie.episodios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serieId' })
  serie: Serie;
}