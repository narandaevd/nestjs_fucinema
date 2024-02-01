import { Inject, Injectable } from "@nestjs/common";
import {AuthService} from '../../../service-layer';
import { AuthResultCode } from "../../../domain";
import { UnauthorizedException } from "../../../exceptions";
import {JwtService} from '@nestjs/jwt';
import { JwtPayload, JwtPayloadWithCipheredInfo, SensitiveInfo } from "../interfaces/jwt-payload";
import { BaseConfiguration } from "../../../config";
import { TokenDto } from "../interfaces/token-dto";
import { AuthJwtConfig } from "../configs/auth-jwt.config";
import { AUTH_JWT_CONFIGURATION_TOKEN } from "./auth-jwt.configuration";
import {createCipher, createDecipher} from 'crypto';

@Injectable()
export class AuthJwtService {
  public constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(AUTH_JWT_CONFIGURATION_TOKEN)
    private readonly authJwtConfiguration: BaseConfiguration<AuthJwtConfig>,
  ) {
    const config = this.authJwtConfiguration.getConfig();
    this.jwtSecret = config.jwtSecret;
    this.keyForSensitiveInfo = config.sensitiveInfo.key;
    this.algorithm = config.sensitiveInfo.encryptAlgorithm;
  }

  private jwtSecret: string;
  private keyForSensitiveInfo: string;
  private algorithm: string;

  private cipherSensitiveInfo(plain: string): string {
    const cipher = createCipher(this.algorithm, this.keyForSensitiveInfo);
    let encrypted = cipher.update(plain, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decipherSensitiveInfo(plain: string): string {
    const decipher = createDecipher(this.algorithm, this.keyForSensitiveInfo);
    let decrypted = decipher.update(plain, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public async signIn(login: string, password: string): Promise<TokenDto> {
    const authResult = await this.authService.login(login, password);
    if (authResult.code === AuthResultCode.Failure)
      throw new UnauthorizedException('Неверный логин или пароль');
    const user = authResult.user;
    const payload: JwtPayloadWithCipheredInfo = {
      userId: authResult.user.uuid,
      login: authResult.user.login,
      sensitiveInfo: this.cipherSensitiveInfo((JSON.stringify({
        password: user.password,
        roles: user.roles,
      }))),
    };
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  public async register(login: string, password: string): Promise<TokenDto> {
    const registerResult = await this.authService.register(login, password);
    if (registerResult.code === AuthResultCode.Failure)
      throw new UnauthorizedException(registerResult.message);
    return this.signIn(login, password);
  }

  public verify(token: string): JwtPayload {
    const cipheredPayload = this.jwtService.verify<JwtPayloadWithCipheredInfo>(token, {
      secret: this.jwtSecret,
    });
    const decipheredInfo: SensitiveInfo = JSON.parse(this.decipherSensitiveInfo(cipheredPayload.sensitiveInfo));
    const plainPayload: JwtPayload = {
      ...cipheredPayload,
      sensitiveInfo: decipheredInfo,
    }
    return plainPayload;
  }

  public extractToken(authHeader?: string): string {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
};
