import { ServiceResponse } from '../vo/serviceResponse.vo';

export interface GetModulesByRolesResponse
  extends ServiceResponse<Record<string, number> | null> {}
