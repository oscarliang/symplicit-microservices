import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User, UserDoc } from './model/user.model';
import { Model } from 'mongoose';
import { IDatabaseSaveOptions } from './common/database/interfaces/database.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserById(id: number): Promise<UserDoc> {
    return this.userModel.findOne({ id: id }).exec();
  }

  async getByUserName(username: string): Promise<UserDoc | undefined> {
    const nameQueryString = Object.assign({
      $regex: username,
      $options: 'i',
    });

    return this.userModel
      .findOne({
        username: nameQueryString,
      })
      .exec();
  }

  async create(user: UserDoc): Promise<UserDoc> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(): Promise<UserDoc[]> {
    return this.userModel.find().exec();
  }

  async update(
    id: string,
    user: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    return this.userModel
      .findByIdAndUpdate(id, user, { ...options, new: true })
      .exec();
  }
}
