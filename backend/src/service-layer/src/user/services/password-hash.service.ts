import {Injectable} from "@nestjs/common";
import {IPasswordHashService} from "../interfaces";
import {createHmac} from 'crypto';

@Injectable()
export class PasswordHashService implements IPasswordHashService {
  encode(alg: string, secret: string, password: string): string {
    return createHmac(alg, secret).update(password).digest('hex');
  }
}
