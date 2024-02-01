import { JwtPayload } from "./jwt-payload";

export type UserFromToken = JwtPayload & {
  iat: number;
  exp: number;
};
