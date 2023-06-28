import {Inject, Injectable} from "@nestjs/common";
import {AuthResultCode, AuthResult, User} from "../../../../domain";
import {IPasswordHashService} from "../interfaces";
import {BaseConfiguration} from "../../../../config";
import {UserConfig} from "../user.config";
import {
  IUserRepository, 
  USER_REPOSITORY_TOKEN
} from "../../../../repository-contracts";
import {
  ILogService,
  LOG_SERVICE
} from "../../log-contract";

import {
  PASSWORD_HASH_SERVICE_TOKEN, 
  USER_CONFIGURATION_TOKEN
} from "../consts";
import { UserService } from './user.service';
import {NotUniqueInstanceException} from "../../../../exceptions";
import {ERROR_SERVICE, IErrorService} from "../../common";

@Injectable()
export class AuthService {
  public constructor(
    @Inject(PASSWORD_HASH_SERVICE_TOKEN)
    private readonly passwordHashService: IPasswordHashService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(USER_CONFIGURATION_TOKEN)
    private readonly userConfiguration: BaseConfiguration<UserConfig>,
    private readonly userService: UserService,
    @Inject(LOG_SERVICE)
    private readonly logService: ILogService,
    @Inject(ERROR_SERVICE)
    private readonly errorService: IErrorService,
  ) {
    const {hash: {alg, secret}} = this.userConfiguration.getConfig();
    this.algorithm = alg;
    this.secret = secret;
  }

  public async login(login: string, password: string): Promise<AuthResult> {
    let user: User;
    try {
      user = await this.userRepository.findOneByLogin(login);
    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      await this.errorService.logAndThrowIfUnknown(e);
    }
    if (!user)
      return new AuthResult(AuthResultCode.Failure, 'Не найден пользователь с таким login');

    const hashedPassword = this
      .passwordHashService
      .encode(this.algorithm, this.secret, password);

    if (user.password !== hashedPassword)
      return new AuthResult(AuthResultCode.Failure, 'Неверный логин или пароль');
    return new AuthResult(AuthResultCode.Success, 'Успешный вход', user);
  }

  public async register(login: string, password: string): Promise<AuthResult> {
    await this.logService.debug({login}, `Регистрация`);
    const newUser = await this.userService.create(login, password);
    if (newUser === null) {
      const msg = 'Логин должен быть уникальным';
      await this.logService.info({login, reason: msg}, `Пользователь не смог зарегистрироваться`);
      throw new NotUniqueInstanceException(msg);
    }

    return new AuthResult(AuthResultCode.Success, 'Успешная регистрация', newUser);
  }

  private algorithm: string;
  private secret: string;
}
