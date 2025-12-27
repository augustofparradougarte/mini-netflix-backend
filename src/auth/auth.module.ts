import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesGuard } from './guards/roles.guard'; // ajusta la ruta si tu guard NO está en ./guards

@Module({
  imports: [
    UsersModule,
    ConfigModule, // para leer JWT_SECRET

    // 🔐 Configuración central del JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'SECRET_KEY_EXAMEN',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
  // Exportamos para que otros módulos (y el APP_GUARD) usen el mismo JwtService
  exports: [AuthService, JwtModule, RolesGuard],
})
export class AuthModule {}
