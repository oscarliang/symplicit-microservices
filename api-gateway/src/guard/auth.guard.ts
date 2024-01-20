import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { getRequest } from '../utils/requests';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../types/auth';
import { ConfigService } from '../config';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get the control request
    const request = getRequest(context);
    this.logger.log(`Req = ${request.headers}`);
    const token = request.headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.configService.get().auth.access_token_secret,
      })) as AuthPayload;
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['roles'] = payload.roles;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
