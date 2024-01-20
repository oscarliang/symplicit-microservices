import { Module } from '@nestjs/common';
import {
  GqlModuleAsyncOptions,
  GraphQLModule as NestGraphQLModule,
} from '@nestjs/graphql';
import { CarController } from './car.controller';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { Car, CarSchema } from './model/car.model';
import mongodbConfig from './config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongodbConfig],
      isGlobal: true,
    }),
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        sortSchema: true,
        playground: true,
        debug: configService.get<boolean>('mongodb.DEBUG'),
        uploads: false,
      }),
    } as GqlModuleAsyncOptions),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
    } as MongooseModuleAsyncOptions),
    MongooseModule.forFeature([
      {
        name: Car.name,
        schema: CarSchema,
      },
    ]),
  ],
  controllers: [CarController],
  providers: [CarService, CarResolver],
})
export class CarModule {}
