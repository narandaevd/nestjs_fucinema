import {User} from "../../../../domain";
import {IUserRepository} from "../../../../repository-contracts";

import {Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { UserTypeormEntity } from '../entities/user.typeorm.entity';
import {UserTypeormEntityMapper} from "../mappers/user.mapper";
import {CONNECTION_RESOLVER} from "../consts";
import {IConnectionRefusedResolver} from "../interfaces/connection-refused-resolver.interface";
import {UnknownException} from "../../../../exceptions";

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  public constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly rawUserTypeormRepository: Repository<UserTypeormEntity>,
    @Inject(CONNECTION_RESOLVER)
    private readonly resolver: IConnectionRefusedResolver,
  ) {}

  async save(user: User): Promise<User> {
    try {
      const mapper = new UserTypeormEntityMapper();
      const entity = mapper.toEntity(user);
      const savedUser = await this
        .rawUserTypeormRepository
        .save(entity);
      return mapper.toModel(savedUser);
    } catch (e: unknown) {
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }

  async findOneByLogin(login: string): Promise<User> {
    try {
      const mapper = new UserTypeormEntityMapper();
      const foundUser = await this.rawUserTypeormRepository.findOneBy({
        login,
      });
      return mapper.toModel(foundUser);
    } catch (e: unknown) {
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
}
