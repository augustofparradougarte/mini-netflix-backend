import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeriesModule } from './series/series.module';
import { EpisodiosModule } from './episodios/episodios.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Lee variables de entorno (Render env y .env local)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';
        const dbUrl = config.get<string>('DATABASE_URL');

        // 🔹 En Render (NODE_ENV=production) usamos la URL de Render
        if (isProd && dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,              // <- AQUÍ usa DATABASE_URL
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false, // necesario en Render
            },
          };
        }

        // 🔹 En local (tu PC) usamos los datos de .env
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: +config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'mini_netflix'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    SeriesModule,
    EpisodiosModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
