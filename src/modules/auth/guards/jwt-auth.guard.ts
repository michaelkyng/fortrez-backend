import { JwtPayload } from '@fortrez/interfaces';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        throw new UnauthorizedException('Token not found');
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as JwtPayload;
      request['user'] = decoded.sub;
      request['userRole'] = decoded.role;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
