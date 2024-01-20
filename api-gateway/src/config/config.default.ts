import { ConfigData } from './config.interface';
import { Transport } from '@nestjs/microservices';

export const DEFAULT_CONFIG: ConfigData = {
  port: Number(process.env.PORT || 3000),
  env: 'production',
  db: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    expiresIn: 30000,
    access_token_secret: 'gongxifacai',
    refresh_token_secret: '',
  },
  swagger: {
    username: '',
    password: '',
  },
  logLevel: '',
  userService: {
    options: {
      host: '',
      port: 3004,
    },
    transport: Transport.TCP,
  },
  roleService: {
    options: {
      host: '',
      port: 3005,
    },
    transport: Transport.TCP,
  },
  carService: {
    options: {
      host: '',
      port: 3003,
    },
    transport: Transport.TCP,
  },
};
