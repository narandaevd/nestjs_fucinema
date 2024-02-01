import { Role } from "../../../domain";

export interface JwtPayload {
  userId: string;
  login: string;
  sensitiveInfo: SensitiveInfo;
}

export interface SensitiveInfo {
  password: string,
  roles: Role[],
}

export interface JwtPayloadWithCipheredInfo {
  userId: string;
  login: string;
  sensitiveInfo: string;
}
