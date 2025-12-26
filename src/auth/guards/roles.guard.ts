import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no tiene @Roles, pasa normal
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token requerido');
    }

    const [, token] = authHeader.split(' ');

    try {
      // 👇 AQUÍ usamos el MISMO secret que en auth.module.ts
      const payload = this.jwtService.verify(token, {
        secret: 'SECRET_KEY_EXAMEN',
      });

      // Guardamos el usuario decodificado por si hace falta después
      request.user = payload;

      if (!requiredRoles.includes(payload.role)) {
        throw new ForbiddenException('No tienes permisos');
      }

      return true;
    } catch (error) {
      console.error('Error verificando token:', error.message);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

