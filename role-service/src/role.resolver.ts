import { Resolver, Query } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './model/role.model';

@Resolver('roles')
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role])
  async findAllRoles(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }
}
