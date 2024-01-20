import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Inject,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthRequestDto } from '../dtos/auth/authRequest.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUserByUsernameResponse } from '../dtos/user/getUserByUsernameResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInVo } from '../dtos/vo/signIn.vo';
import { GetModulesByRolesResponse } from '../dtos/user/getModulesByRolesResponse.dto';
import { AuthResponseDto } from '../dtos/auth/authResponse.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('ROLE_SERVICE') private readonly roleServiceClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() authDto: AuthRequestDto): Promise<AuthResponseDto> {
    const { password, username } = authDto;

    const userResponse: GetUserByUsernameResponse = await firstValueFrom(
      this.userServiceClient.send('get_user_by_username', username),
    );

    if (userResponse.statusCode === HttpStatus.NOT_FOUND) {
      throw new UnauthorizedException();
    }

    if (userResponse.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: userResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userResponse.data.password !== password) {
      throw new UnauthorizedException();
    }

    const roles = userResponse.data.roles;

    const modulesResponse: GetModulesByRolesResponse = await firstValueFrom(
      this.roleServiceClient.send('get_modules_by_roles', roles),
    );

    const signInPayload: SignInVo = {
      username: userResponse.data.username,
      roles: roles,
    };

    return {
      ...modulesResponse,
      data: {
        access_token: await this.jwtService.signAsync(signInPayload),
        modules: modulesResponse.data,
      },
    };
  }
}
