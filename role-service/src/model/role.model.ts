import { Field, ObjectType } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CallbackWithoutResultAndOptionalError,
  Document,
  HydratedDocument,
} from 'mongoose';
import { ENUM_ROLE_TYPE } from './role.register';
import { RoleModule } from './roleModule.model';

export type RoleDocument = HydratedDocument<Role>;

/**
 * https://medium.com/@vikramgyawali57/mastering-mongoose-pre-hooks-a-guide-to-enhancing-data-manipulation-efbec44fc66f
 */
@ObjectType()
@Schema()
export class Role {
  @Field()
  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 30,
    type: String,
  })
  name: string;

  @Field(() => ENUM_ROLE_TYPE)
  @Prop({
    required: true,
    enum: ENUM_ROLE_TYPE,
    unique: true,
    type: String,
  })
  type: ENUM_ROLE_TYPE;

  @Field(() => [RoleModule], { nullable: true })
  @Prop()
  roleModules?: RoleModule[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDoc = Role & Document;

RoleSchema.pre(
  'findOneAndUpdate',
  async function (next: CallbackWithoutResultAndOptionalError) {
    const updateType = this.getUpdate();
    if ('$addToSet' in updateType) {
      const docToUpdate = await this.model.findOne(this.getQuery());
      const existingModules =
        docToUpdate?.roleModules?.map((roleModule) => roleModule.module.name) ||
        [];
      const inputModule = updateType['$addToSet'].roleModules.module.name;
      if (existingModules.includes(inputModule)) {
        throw new BadRequestException({
          description: 'can not set the duplicated role module',
        });
      }
    }

    next();
  },
);
