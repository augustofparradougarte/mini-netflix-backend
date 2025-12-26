import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Episodio } from '../../episodios/entities/episodio.entity';

@Entity('series')
export class Serie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  genero: string;

  @Column({ type: 'text' })
  sinopsis: string;

  @Column()
  urlPortada: string; // poster o imagen de portada

  @OneToMany(() => Episodio, (episodio) => episodio.serie)
  episodios: Episodio[];
}