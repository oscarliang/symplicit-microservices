import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDoc, RoleDocument } from './model/role.model';
import { RoleModuleDoc } from './model/roleModule.model';
import { Module, ModuleDocument } from './model/module.model';
import { Model } from 'mongoose';
import { ENUM_ROLE_TYPE } from './model/role.register';

/**
 * ref: https://github.com/nestjs/nest/issues/2086 transaction
 */

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async findAllRoles(): Promise<RoleDoc[]> {
    return this.roleModel.find().exec();
  }

  async findModulesByRoleType(types: ENUM_ROLE_TYPE[]): Promise<RoleDoc[]> {
    const QueryString = Object.assign({
      type: types,
    });
    return this.roleModel.find(QueryString).exec();
  }

  async createRole(role: RoleDoc): Promise<RoleDoc> {
    const newRole = new this.roleModel(role);
    return newRole.save();
  }

  async addRoleModuleByRoleId(
    roleId: string,
    roleModule: RoleModuleDoc,
  ): Promise<RoleDoc> {
    return this.roleModel
      .findByIdAndUpdate(
        { _id: roleId },
        {
          $addToSet: {
            roleModules: roleModule,
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async updateRoleModuleByRoleId(
    roleId: string,
    moduleName: string,
    permission: number,
  ): Promise<RoleDoc> {
    return this.roleModel
      .findOneAndUpdate(
        { _id: roleId, 'roleModules.module.name': moduleName },
        { $set: { 'roleModules.$.permission': permission } },
        {
          new: true,
        },
      )
      .exec();
  }

  async createModule(module: Module): Promise<Module> {
    const newModule = new this.moduleModel(module);
    return newModule.save();
  }
}
