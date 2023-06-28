import {User} from "../../../domain";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findOneByLogin(login: string): Promise<User>;
};
