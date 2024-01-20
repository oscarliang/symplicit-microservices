import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
  Document,
} from 'mongoose';
import { ENUM_ROLE_TYPE } from './role.register';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

/**
 ref: https://github.com/andrechristikan/ack-nestjs-boilerplate/blob/main/src/modules/user/repository/entities/user.entity.ts
 */

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Field()
  @Prop({
    required: true,
    sparse: true,
    index: true,
    trim: true,
    type: String,
    unique: true,
    maxlength: 100,
  })
  username: string;

  @Field()
  @Prop({
    required: true,
  })
  password: string;

  @Field(() => [ENUM_ROLE_TYPE])
  @Prop({
    required: true,
    type: [String],
    enum: ENUM_ROLE_TYPE,
  })
  roles: ENUM_ROLE_TYPE[];
}

export type UserDoc = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.username = this.username.toLowerCase();

  next();
});
