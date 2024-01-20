import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_user_by_username')
  public async getUserByUsername(username: string): Promise<any> {
    const user = await this.userService.getByUserName(username);
    if (user) {
      return {
        statusCode: HttpStatus.OK,
        message: 'get_user_by_username_success',
        data: user,
      };
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'get_user_by_username_not_found',
        data: null,
      };
    }
  }
}
