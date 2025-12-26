import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EpisodiosService } from './episodios.service';
import { CreateEpisodioDto } from './dto/create-episodio.dto';
import { UpdateEpisodioDto } from './dto/update-episodio.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('episodios')
export class EpisodiosController {
  constructor(private readonly episodiosService: EpisodiosService) {}

  // 🔓 PÚBLICO
  @Get()
  findAll() {
    return this.episodiosService.findAll();
  }

  // 🔓 PÚBLICO
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.episodiosService.findOne(id);
  }

  // 🔐 SOLO ADMIN
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateEpisodioDto) {
    return this.episodiosService.create(dto);
  }

  // 🔐 SOLO ADMIN
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEpisodioDto,
  ) {
    return this.episodiosService.update(id, dto);
  }

  // 🔐 SOLO ADMIN
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.episodiosService.remove(id);
  }
}

