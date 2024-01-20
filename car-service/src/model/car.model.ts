import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@ObjectType()
@Schema()
export class Car {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  id: number;

  @Field()
  @Prop({
    required: true,
    trim: true,
    type: String,
    unique: true,
    maxlength: 20,
  })
  brand: string;

  @Field()
  @Prop({
    required: true,
    trim: true,
    type: String,
    maxlength: 50,
  })
  name: string;

  @Field()
  @Prop({
    required: true,
    type: String,
    maxlength: 50,
  })
  price: string;

  @Field()
  @Prop({
    required: true,
    type: String,
    maxlength: 50,
  })
  drive: string;

  @Field()
  @Prop({
    required: true,
    type: String,
    maxlength: 150,
  })
  imageUrl: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);

export type CarDoc = Car & Document;
