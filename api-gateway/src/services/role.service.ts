import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_SERVICE') private readonly roleClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
