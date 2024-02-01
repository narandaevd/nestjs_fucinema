import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "../../../domain";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export const ROLE_KEY = 'role-key';
export const HasRoles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);

export const AuthorizedUserHasRoles = (...roles: Role[]) => applyDecorators(
  HasRoles(...roles),
  UseGuards(AuthGuard, RolesGuard),
);
