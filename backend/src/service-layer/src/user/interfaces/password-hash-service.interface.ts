export interface IPasswordHashService {
  encode(alg: string, secret: string, password: string): string;
}
