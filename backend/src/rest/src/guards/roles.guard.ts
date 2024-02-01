import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../../domain";
import { ROLE_KEY } from "../decorators/has-roles.decorator";
import { UserFromToken } from "../interfaces/user-from-token";

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private reflector: Reflector
  ) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0)
      return true;

    const user = context
      .switchToHttp()
      .getRequest<Request & {user: UserFromToken}>()
      .user;

    const userHasEveryRole = requiredRoles
      .every(
        requiredRole => user
          .sensitiveInfo
          .roles
          .includes(requiredRole)
        );
    return userHasEveryRole;
  }
}
