import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SessionService } from './services/sessionService';
import { RoleService } from './role.service';
import { RoleDoc } from './model/role.model';
import { getModulesByRoles } from './services/permissionService';
import { ENUM_ROLE_TYPE } from './model/role.register';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('init_roles')
  async initRoles() {
    const roles = await this.roleService.findAllRoles();
    const sessionService = new SessionService();
    try {
      await sessionService.createConnection();
      roles.forEach((role: RoleDoc) => {
        const moduleRecords: Record<string, number> = {};
        role.roleModules.forEach((rm) => {
          const moduleName = rm.module.name;
          if (moduleRecords.hasOwnProperty(moduleName)) {
            if (rm.permission > moduleRecords[moduleName]) {
              moduleRecords[moduleName] = rm.permission;
            }
          } else {
            moduleRecords[moduleName] = rm.permission;
          }
        });
        sessionService.set(
          `prod:roles:${role.type}`,
          JSON.stringify(moduleRecords),
        );
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'init_roles_success',
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.toString(),
      };
    } finally {
      await sessionService.closeConnection();
    }
  }

  @MessagePattern('get_modules_by_roles')
  async getModulesByRoles(roles: ENUM_ROLE_TYPE[]): Promise<any> {
    try {
      const modules = await getModulesByRoles(roles);
      return {
        statusCode: HttpStatus.OK,
        message: 'get_modules_by_roles_success',
        data: modules,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'get_modules_by_roles_error',
        data: null,
      };
    }
  }
}
