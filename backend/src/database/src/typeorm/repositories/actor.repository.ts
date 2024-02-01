import {Inject, Injectable} from "@nestjs/common";
import {Actor} from "../../../../domain";
import {IActorRepository} from "../../../../repository-contracts";
import {ActorTypeormEntity} from "../entities";
import {ActorTypeormEntityMapper} from "../mappers";
import {NotFoundException, UnknownException} from "../../../../exceptions";
import {IPagination} from "../../../../repository-contracts";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ACL_ERROR_RESOLVER, CONNECTION_RESOLVER } from "../consts";
import { IConnectionRefusedResolver } from "../interfaces/connection-refused-resolver.interface";
import { IAclCheckErrorResolver } from "../interfaces/acl-check-error-resolver.interface";

@Injectable()
export class ActorTypeormRepository implements IActorRepository {
  public constructor(
    @InjectRepository(ActorTypeormEntity)
    private readonly repo: Repository<ActorTypeormEntity>,
    @Inject(CONNECTION_RESOLVER)
    private readonly resolver: IConnectionRefusedResolver,
    @Inject(ACL_ERROR_RESOLVER)
    private readonly aclErrorResolver: IAclCheckErrorResolver,
  ) {}

  async findManyAndCount(skip: number, take: number): Promise<IPagination<Actor>> {
    try {
      const qb = this.repo
        .createQueryBuilder('a')
        .select('a')
        .skip(skip)
        .take(take);

      const [data, count] = await qb.getManyAndCount();
      const mapper = new ActorTypeormEntityMapper();
      return {
        data: data.map(e => mapper.toModel(e)), 
        count
      };
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
  
  async create(
    firstName: string, 
    lastName: string, 
    middleName: string, 
    country: string
  ): Promise<Actor> {
    try {
      const newActor = new Actor(firstName, lastName);
      if (middleName)
        newActor.middleName = middleName;
      if (country)
        newActor.country = country;
      const mapper = new ActorTypeormEntityMapper();
      await this.repo.save(mapper.toEntity(newActor));
      return newActor;
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
  async update(
    uuid: string,
    firstName: string,
    lastName: string,
    middleName: string,
    country: string
  ): Promise<Actor> {
    try {
      const entity = await this.repo.findOneBy({uuid});
      if (!entity)
        throw new NotFoundException('Не найден актёр с таким uuid');
      const mapper = new ActorTypeormEntityMapper();
      await this.repo.update(uuid, {
        firstName,
        lastName,
        middleName,
        country
      });
      const updatedEntity = await this.repo.findOneBy({uuid});
      return mapper.toModel(updatedEntity);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
  async delete(uuid: string): Promise<void> {
    try {
      await this.repo.delete(uuid);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
}
