import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../interfaces/user.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private async getUser(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authorized');
    }
    return user;
  }

  private async getUserRole(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userRole = request.userRole;
    return userRole;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = await this.getUser(context);
    const userRole = await this.getUserRole(context);
    if (!userRole) {
      throw new ForbiddenException('User has no role assigned');
    }

    const hasRequiredRole = requiredRoles.some((role) => userRole === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `User with role ${userRole} does not have required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
