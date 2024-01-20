import { Module } from '@nestjs/common';
import {
  GqlModuleAsyncOptions,
  GraphQLModule as NestGraphQLModule,
} from '@nestjs/graphql';
import { UserController } from './user.controller';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserService } from './user.service';
import { UsersResolver } from './user.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
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
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UsersResolver],
})
export class UserModule {}
