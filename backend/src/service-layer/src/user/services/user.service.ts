import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN
} from '../../../../repository-contracts';
import {User} from '../../../../domain';
import {IPasswordHashService} from '../interfaces';
import {PASSWORD_HASH_SERVICE_TOKEN, USER_CONFIGURATION_TOKEN} from '../consts';
import {BaseConfiguration} from '../../../../config';
import {UserConfig} from '../user.config';
import {ERROR_SERVICE, IErrorService} from '../../common';

@Injectable()
export class UserService {
  public constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASH_SERVICE_TOKEN)
    private readonly passwordHashService: IPasswordHashService,
    @Inject(USER_CONFIGURATION_TOKEN)
    private readonly conf: BaseConfiguration<UserConfig>,
    @Inject(ERROR_SERVICE)
    private readonly errorService: IErrorService,
  ) {
    const {hash: {alg, secret}} = this.conf.getConfig();
    this.algorithm = alg;
    this.secret = secret;
  }

  private algorithm: string;
  private secret: string;

  public async create(
    login: string, 
    password: string
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOneByLogin(login);
      if (user)
        return null;

      const hashedPassword = this
        .passwordHashService
        .encode(this.algorithm, this.secret, password);

      const newUser = new User(login, hashedPassword);
      return this.userRepository.save(newUser);

    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      await this.errorService.logAndThrowIfUnknown(e);
    }
  }
}
