import { BaseConfiguration } from "../../../config";
import { AuthJwtConfig } from "../configs/auth-jwt.config";

export class AuthJwtConfiguration extends BaseConfiguration<AuthJwtConfig> {};

export const AUTH_JWT_CONFIGURATION_TOKEN = AuthJwtConfiguration.name;
