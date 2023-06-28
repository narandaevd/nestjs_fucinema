import {
  Film,
  UpdateFilmDto
} from "../../../domain";

export interface IFilmPagination {
  totalCount: number;
  films: Film[]
}

export interface IFilmRepository {
  findManyAndTotalCount(skip?: number, take?: number): Promise<IFilmPagination>;
  update(dto: UpdateFilmDto): Promise<Film>;
  getOneWithDetails(uuid: string): Promise<Film>;
}
