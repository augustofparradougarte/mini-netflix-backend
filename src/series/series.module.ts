import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Serie } from './entities/serie.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Serie]),
    AuthModule, // 👈 IMPORTANTE
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}

