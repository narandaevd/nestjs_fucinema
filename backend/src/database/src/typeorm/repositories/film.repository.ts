import {
  UpdateFilmDto,
  Film,
} from '../../../../domain';
import {IFilmPagination, IFilmRepository} from '../../../../repository-contracts';
import {FilmAlreadyHasActorException, NotFoundException, UnknownException} from '../../../../exceptions';

import { Inject, Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {FilmTypeormEntity} from '../entities/film.typeorm.entity';
import {FilmTypeormEntityMapper} from '../mappers/film.mapper';
import {ACL_ERROR_RESOLVER, CONNECTION_RESOLVER} from '../consts';
import {IConnectionRefusedResolver} from '../interfaces/connection-refused-resolver.interface';
import { ActorTypeormEntity } from '../entities';
import { IAclCheckErrorResolver } from '../interfaces/acl-check-error-resolver.interface';

@Injectable()
export class FilmTypeormRepository implements IFilmRepository {
  
  public constructor(
    @InjectRepository(FilmTypeormEntity)
    private readonly rawFilmTypeormRepository: Repository<FilmTypeormEntity>,
    @InjectRepository(ActorTypeormEntity)
    private readonly rawActorTypeormRepository: Repository<ActorTypeormEntity>,
    @Inject(CONNECTION_RESOLVER)
    private readonly resolver: IConnectionRefusedResolver,
    @Inject(ACL_ERROR_RESOLVER)
    private readonly aclErrorResolver: IAclCheckErrorResolver,
  ) {}

  async findManyAndTotalCount(
    skip: number,
    take: number,
    title?: string,
    description?: string,
  ): Promise<IFilmPagination> {
    try {

      let whereOptions: FindOptionsWhere<FilmTypeormEntity> = {};
      if (title)
        whereOptions.title = ILike(`%${title}%`);
      if (description)
        whereOptions.description = ILike(`%${description}%`);

      const mapper = new FilmTypeormEntityMapper();
      const [filmEntities, totalCount] = await this
        .rawFilmTypeormRepository
        .findAndCount({
          skip,
          take,
          where: whereOptions,
        });
      const films = filmEntities.map(e => mapper.toModel(e));
      return {
        films,
        totalCount
      }
    } catch (e: unknown) {
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }

  async update(dto: UpdateFilmDto): Promise<Film> {
    try {
      const mapper = new FilmTypeormEntityMapper();
      await this
        .rawFilmTypeormRepository
        .update(dto.uuid, dto);
      const updatedFilm = await this
        .rawFilmTypeormRepository
        .findOneBy({uuid: dto.uuid});
      return mapper.toModel(updatedFilm);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }

  async getOneWithDetails(uuid: string): Promise<Film> {
    try {
      const mapper = new FilmTypeormEntityMapper();
      const filmEntity = await this
        .rawFilmTypeormRepository
        .findOne({
          where: {uuid},
          relations: {
            actors: true,
            company: true,
            reports: {
              user: true,
            },
          }
        });
      if (!filmEntity)
        throw new NotFoundException('Фильм с этим uuid не существует');
      return mapper.toModel(filmEntity);
    } catch (e: unknown) {
      this.resolver.throwIfConnectionRefused(e);
      if (e instanceof NotFoundException)
        throw e;
      throw new UnknownException(e);
    }
  }

  async save(film: Film): Promise<Film> {
    try {
      const mapper = new FilmTypeormEntityMapper();
      const filmEntity = mapper.toEntity(film);
      const savedEntity = await this.rawFilmTypeormRepository.save(filmEntity);
      return mapper.toModel(savedEntity);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      await this.rawFilmTypeormRepository.delete(uuid);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }

  async addActorToFilm(filmUuid: string, actorUuid: string): Promise<Film> {
    try {
      const filmEntity = await this
        .rawFilmTypeormRepository
        .findOne({
          relations: ['actors'],
          where: {uuid: filmUuid},
        });
      if (filmEntity.actors.find(actor => actor.uuid === actorUuid))
        throw new FilmAlreadyHasActorException();
      const actorEntity = await this.rawActorTypeormRepository.findOneBy({uuid: actorUuid});
      filmEntity.actors.push(actorEntity);
      return await this.rawFilmTypeormRepository.save(filmEntity);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
}
