import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';
import { Transport, TcpOptions } from '@nestjs/microservices';

async function bootstrap() {
  const API_GATEWAY_PORT = Number(process.env.PORT);
  const app = await NestFactory.createMicroservice(RoleModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: API_GATEWAY_PORT,
    },
  } as TcpOptions);
  await app.listen().then(() => {
    console.log(
      `ROLE_SERVICE_API ENDPOINT: http://localhost:${API_GATEWAY_PORT}`,
    );
    console.log(`Swagger ENDPOINT: http://localhost:${API_GATEWAY_PORT}/api`);
  });
}
bootstrap();
