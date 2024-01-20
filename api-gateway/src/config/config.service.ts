import { Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from './config.default';
import { ConfigData, ConfigDatabase, ConfigSwagger } from './config.interface';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = ConfigService.parseConfigFromEnv(process.env);
  }

  private static parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.PORT!, 10),
      db: ConfigService.parseDBConfig(env, DEFAULT_CONFIG.db),
      swagger: ConfigService.parseSwaggerConfig(env, DEFAULT_CONFIG.swagger),
      logLevel: env.LOG_LEVEL!,
      auth: {
        expiresIn: Number(env.TOKEN_EXPIRY),
        access_token_secret: env.JWT_ACCESS_TOKEN_SECRET!,
        refresh_token_secret: env.JWT_REFRESH_TOKEN_SECRET!,
      },
      userService: {
        options: {
          host: env.USER_SERVICE_HOST!,
          port: Number(env.USER_SERVICE_PORT!),
        },
        transport: Transport.TCP,
      },
      roleService: {
        options: {
          host: env.ROLE_SERVICE_HOST!,
          port: Number(env.ROLE_SERVICE_PORT!),
        },
        transport: Transport.TCP,
      },
      carService: {
        options: {
          host: env.CAR_SERVICE_HOST!,
          port: Number(env.CAR_SERVICE_PORT!),
        },
        transport: Transport.TCP,
      },
    };
  }
  private static parseDBConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigDatabase>,
  ) {
    return {
      url: env.DATABASE_URL || defaultConfig.url,
    };
  }
  private static parseSwaggerConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigSwagger>,
  ) {
    return {
      username: env.SWAGGER_USERNAME || defaultConfig.username,
      password: env.SWAGGER_PASSWORD || defaultConfig.password,
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
