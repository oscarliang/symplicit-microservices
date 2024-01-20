import { ENUM_ROLE_TYPE } from '../../types/auth';

export interface UserVo {
  username: string;
  password: string;
  roles: ENUM_ROLE_TYPE[];
}
