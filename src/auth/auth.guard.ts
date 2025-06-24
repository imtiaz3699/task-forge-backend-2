import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private extractTokenFromHeader(request: Request): string | undefined {
    const token =
      request.headers.authorization?.split(' ')?.[2] ??
      request.headers.authorization?.split(' ')?.[1];
    return token;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token is not available.');
    }
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}
