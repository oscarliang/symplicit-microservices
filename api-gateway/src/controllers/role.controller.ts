import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InitRoleResponse } from '../dtos/role/initRoleResponse.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(
    @Inject('ROLE_SERVICE') private readonly roleServiceClient: ClientProxy,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('init')
  async initRoles() {
    const initRoleResponse: InitRoleResponse = await firstValueFrom(
      this.roleServiceClient.send('init_roles', 'init'),
    );

    if (initRoleResponse.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: initRoleResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return initRoleResponse;
  }
}
