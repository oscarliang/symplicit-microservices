import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

/**
 *  Ref : https://github.com/pacyL2K19/graphql-mongodb-nestjs-tutorial/blob/develop/src/app/book/entities/book.entity.ts
 */

@ObjectType()
@Schema()
export class Module {
  @Field()
  @Prop({
    required: true,
    default: 0,
  })
  level: number;

  @Field()
  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 30,
    type: String,
  })
  name: string;

  @Field()
  @Prop({
    required: false,
    trim: true,
    type: String,
  })
  description?: string;

  @Field({ nullable: true })
  @Prop()
  parent?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
