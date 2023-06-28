import {
  UpdateFilmDto,
  Film,
} from '../../../../domain';
import {IFilmPagination, IFilmRepository} from '../../../../repository-contracts';
import {NotFoundException, UnknownException} from '../../../../exceptions';

import { Inject, Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FilmTypeormEntity} from '../entities/film.typeorm.entity';
import {FilmTypeormEntityMapper} from '../mappers/film.mapper';
import {CONNECTION_RESOLVER} from '../consts';
import {IConnectionRefusedResolver} from '../interfaces/connection-refused-resolver.interface';

@Injectable()
export class FilmTypeormRepository implements IFilmRepository {
  
  public constructor(
    @InjectRepository(FilmTypeormEntity)
    private readonly rawFilmTypeormRepository: Repository<FilmTypeormEntity>,
    @Inject(CONNECTION_RESOLVER)
    private readonly resolver: IConnectionRefusedResolver,
  ) {}

  async findManyAndTotalCount(skip: number, take: number): Promise<IFilmPagination> {
    try {
      const mapper = new FilmTypeormEntityMapper();
      const [filmEntities, totalCount] = await this
        .rawFilmTypeormRepository
        .findAndCount({
          skip, 
          take
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
}
