import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { RoleController } from './controllers/role.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule as config, ConfigService } from './config';
import { ConfigModule } from '@nestjs/config';
import { RoleService } from './services/role.service';
import { AuthController } from './controllers/auth.controller';
import { CarController } from './controllers/car.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [config],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get().auth.access_token_secret,
          signOptions: { expiresIn: configService.get().auth.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
    config,
  ],
  controllers: [RoleController, AuthController, CarController],
  providers: [
    {
      provide: 'ROLE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const roleServiceOptions = configService.get().roleService;
        return ClientProxyFactory.create(roleServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get().userService;
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'CAR_SERVICE',
      useFactory: (configService: ConfigService) => {
        const carServiceOptions = configService.get().carService;
        return ClientProxyFactory.create(carServiceOptions);
      },
      inject: [ConfigService],
    },
    RoleService,
  ],
})
export class AppModule {}
