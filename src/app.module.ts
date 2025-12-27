import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeriesModule } from './series/series.module';
import { EpisodiosModule } from './episodios/episodios.module';
import { RolesGuard } from './auth/guards/roles.guard'; // 👈 Ajusta la ruta si es necesario

@Module({
  imports: [
    // 🌍 Variables de entorno (.env local + Environment de Render)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🗄️ Configuración de TypeORM (local + Render)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (databaseUrl) {
          // 👉 MODO RENDER: usa DATABASE_URL + SSL
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false, // Render exige SSL, pero sin validar certificado propio
            },
          };
        }

        // 👉 MODO LOCAL: usa DB_HOST, DB_PORT, etc.
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'mini_netflix'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    // 📦 Módulos de tu app
    UsersModule,
    AuthModule,
    SeriesModule,
    EpisodiosModule,
  ],

  // 🚨 Guard global de roles
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
