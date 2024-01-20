import { ENUM_ROLE_TYPE } from '../model/role.register';
import { SessionService } from './sessionService';

export async function getModulesByRoles(
  roles: ENUM_ROLE_TYPE[],
): Promise<Record<string, number>> {
  const moduleRecords: Record<string, number> = {};

  const sessionService = new SessionService();
  try {
    await sessionService.createConnection();

    for (const role of roles) {
      const modules = await sessionService.get<string>(`prod:roles:${role}`);
      const moduleObj: Record<string, number> = JSON.parse(modules);
      Object.entries(moduleObj).forEach(([moduleName, permission]) => {
        if (moduleRecords.hasOwnProperty(moduleName)) {
          if (permission > moduleRecords[moduleName]) {
            moduleRecords[moduleName] = permission;
          }
        } else {
          moduleRecords[moduleName] = permission;
        }
      });
    }
    return moduleRecords;
  } finally {
    await sessionService.closeConnection();
  }
}
