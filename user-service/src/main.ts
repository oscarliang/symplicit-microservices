import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport, TcpOptions } from '@nestjs/microservices';

async function bootstrap() {
  const API_GATEWAY_PORT = Number(process.env.PORT);
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: API_GATEWAY_PORT,
    },
  } as TcpOptions);
  await app.listen().then(() => {
    console.log(
      `USER_SERVICE_TCP ENDPOINT: http://localhost:${API_GATEWAY_PORT}`,
    );
    console.log(`Swagger ENDPOINT: http://localhost:${API_GATEWAY_PORT}/api`);
  });
}
bootstrap();
