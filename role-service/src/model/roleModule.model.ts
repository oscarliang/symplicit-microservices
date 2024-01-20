import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Module } from './module.model';

export type RoleModuleDocument = HydratedDocument<RoleModule>;

/**
 *  Ref : https://github.com/pacyL2K19/graphql-mongodb-nestjs-tutorial/blob/develop/src/app/book/entities/book.entity.ts
 */

@ObjectType()
@Schema()
export class RoleModule {
  @Field(() => Module, { nullable: false })
  @Prop()
  module: Module;

  @Field(() => Int, { nullable: false, defaultValue: 1 })
  @Prop({
    type: Number,
    max: 15,
  })
  permission: number;
}

export type RoleModuleDoc = RoleModule & Document;

export const RoleModuleSchema = SchemaFactory.createForClass(RoleModule);
