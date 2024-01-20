import { Module } from '@nestjs/common';
import {
  GqlModuleAsyncOptions,
  GraphQLModule as NestGraphQLModule,
} from '@nestjs/graphql';
import { RoleController } from './role.controller';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { Role, RoleSchema } from './model/role.model';
import { Module as ModuleModel, ModuleSchema } from './model/module.model';
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
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: ModuleModel.name,
        schema: ModuleSchema,
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleResolver],
})
export class RoleModule {}
