import { UserVo } from '../vo/user.vo';
import { ServiceResponse } from '../vo/serviceResponse.vo';

export interface GetUserByUsernameResponse
  extends ServiceResponse<UserVo | null> {}
