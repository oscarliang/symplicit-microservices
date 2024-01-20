import { ENUM_ROLE_TYPE } from '../../types/auth';

export interface SignInVo {
  username: string;
  roles: ENUM_ROLE_TYPE[];
}
