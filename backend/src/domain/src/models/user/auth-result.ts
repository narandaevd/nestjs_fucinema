import {AuthResultCode} from "./auth-result-code.enum";
import { User } from './user';

export class AuthResult {
  public constructor(
    public readonly code: AuthResultCode,
    public readonly message?: string,
    public readonly user?: User,
  ) {}
}
