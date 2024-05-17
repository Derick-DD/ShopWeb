// Nest dependencies
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Local files
import { jwtManipulationService } from '../Common/Service/jwt.manipulation.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (role === undefined) return true;

    const request = await context.switchToHttp().getRequest();
    const userRole = await jwtManipulationService.decodeJwtToken(
      request.headers.authorization,
      'role',
    );
    if (userRole >= role) {
      return true;
    }

    return false;
  }
}
