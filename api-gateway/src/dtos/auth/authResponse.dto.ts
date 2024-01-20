import { ServiceResponse } from '../vo/serviceResponse.vo';

interface AuthResponse {
  access_token: string;

  modules: Record<string, number>;
}

export interface AuthResponseDto extends ServiceResponse<AuthResponse> {}
