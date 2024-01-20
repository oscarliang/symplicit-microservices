import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './model/user.model';

@Resolver('users')
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
