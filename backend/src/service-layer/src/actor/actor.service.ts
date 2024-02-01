import {Inject, Injectable} from "@nestjs/common";
import {ACTOR_REPOSITORY_TOKEN, IActorRepository, IPagination} from "../../../repository-contracts";
import {Actor} from "../../../domain";

@Injectable()
export class ActorService {
  public constructor(
    @Inject(ACTOR_REPOSITORY_TOKEN)
    private readonly actorRepository: IActorRepository,
  ) {}

  async getMany(skip: number, take: number): Promise<IPagination<Actor>> {
    return this.actorRepository.findManyAndCount(skip, take);
  }

  async create(firstName: string, 
    lastName: string, middleName: string, 
    country: string
  ): Promise<Actor> {
    return await this.actorRepository.create(
      firstName,
      lastName,
      middleName,
      country
    );
  }

  async update(
    uuid: string, firstName: string, 
    lastName: string, middleName: string, 
    country: string
  ): Promise<Actor> {
    return await this.actorRepository.update(
      uuid,
      firstName,
      lastName,
      middleName,
      country,
    );
  }

  async delete(uuid: string): Promise<void> {
    await this.actorRepository.delete(uuid); 
  }
}
