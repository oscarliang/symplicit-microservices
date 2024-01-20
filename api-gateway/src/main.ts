import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Cars Management')
    .setDescription('The Cars API description')
    .setVersion('1.0')
    .addTag('cars')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = new ConfigService();
  configService.loadFromEnv();
  const API_GATEWAY_PORT = Number(configService.get().port);
  await app.listen(API_GATEWAY_PORT, () => {
    console.log(`API_GATEWAY ENDPOINT: http://localhost:${API_GATEWAY_PORT}`);
    console.log(`Swagger ENDPOINT: http://localhost:${API_GATEWAY_PORT}/api`);
  });
}

bootstrap()
  .then(() => {
    console.log('starting bootstrap');
  })
  .catch((e) => {
    console.log(e);
  });
