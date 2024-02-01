import {
  Film,
  UpdateFilmDto
} from "../../../domain";

export interface IFilmPagination {
  totalCount: number;
  films: Film[]
}

export interface IFilmRepository {
  findManyAndTotalCount(
    skip?: number, 
    take?: number,
    title?: string,
    description?: string,
  ): Promise<IFilmPagination>;
  update(dto: UpdateFilmDto): Promise<Film>;
  getOneWithDetails(uuid: string): Promise<Film>;

  save(film: Film): Promise<Film>;
  delete(uuid: string): Promise<void>;
  addActorToFilm(filmUuid: string, actorUuid: string): Promise<Film>;
}
