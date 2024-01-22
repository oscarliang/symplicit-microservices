import { NestFactory } from '@nestjs/core';
import { CarModule } from './car.module';
import { Transport, TcpOptions } from '@nestjs/microservices';

async function bootstrap() {
  const API_GATEWAY_PORT = Number(process.env.PORT);
  const GRAPHQL_GATEWAY_PORT = Number(process.env.GRAPHQL_PORT);
  const microserviceTcp = await NestFactory.createMicroservice(CarModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: API_GATEWAY_PORT,
    },
  } as TcpOptions);
  await microserviceTcp.listen().then(() => {
    console.log(
      `CAR_SERVICE_TCP ENDPOINT: http://localhost:${API_GATEWAY_PORT}`,
    );
  });

  const app = await NestFactory.create(CarModule);
  app.enableCors();
  await app.listen(GRAPHQL_GATEWAY_PORT, () => {
    console.log(
      `CAR_SERVICE_API ENDPOINT: http://localhost:${GRAPHQL_GATEWAY_PORT}`,
    );
    console.log(
      `Swagger ENDPOINT: http://localhost:${GRAPHQL_GATEWAY_PORT}/api`,
    );
  });
}
bootstrap();
