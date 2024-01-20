import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import {
  FindAllCarsResponse,
  FindAllCarsTcpResponse,
} from '../dtos/car/findAllCarsResponse.dto';
import { AuthGuard } from '../guard/auth.guard';
import { GetModulesByRolesResponse } from '../dtos/user/getModulesByRolesResponse.dto';

@Controller('cars')
@ApiTags('cars')
export class CarController {
  constructor(
    @Inject('CAR_SERVICE') private readonly carServiceClient: ClientProxy,
    @Inject('ROLE_SERVICE') private readonly roleServiceClient: ClientProxy,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard)
  async findAllCars(@Req() request: Request): Promise<FindAllCarsResponse> {
    const findAllCarsResponse: FindAllCarsTcpResponse = await firstValueFrom(
      this.carServiceClient.send('find_all_cars', 'init'),
    );

    if (findAllCarsResponse.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: findAllCarsResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const response: FindAllCarsResponse = findAllCarsResponse;

    if ('roles' in request) {
      const modulesResponse: GetModulesByRolesResponse = await firstValueFrom(
        this.roleServiceClient.send('get_modules_by_roles', request['roles']),
      );
      if (modulesResponse) {
        response.data.modules = modulesResponse.data;
      }
    }

    return response;
  }
}
