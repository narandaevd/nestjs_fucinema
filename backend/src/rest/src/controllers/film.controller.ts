import {Body, Controller, Get, Param, ParseIntPipe, Patch, Query} from "@nestjs/common";
import {API_V1} from "../consts";
import { FilmService } from '../../../service-layer';
import {Film, UpdateFilmDto} from "../../../domain";
import {UpdateFilmRestDto} from "../dtos";
import {UuidParam} from "../decorators";
import {IFilmPagination} from "../../../repository-contracts/src";

@Controller(`${API_V1}/films`)
export class FilmController {
  public constructor(
    private readonly filmService: FilmService,
  ) {}

  @Get()
  async getFilms(
    @Query('skip') skip: string,
    @Query('take') take: string,
  ): Promise<IFilmPagination> {
    return await this.filmService.getMany(parseInt(skip), parseInt(take));
  }

  @Get('/:uuid')
  async getOneWithDetails(
    @UuidParam() uuid: string,
  ): Promise<Film> {
    return await this.filmService.getOneWithDetails(uuid);
  }

  @Patch('/:uuid')
  async update(
    @UuidParam() uuid: string,
    @Body() restDto: UpdateFilmRestDto
  ) {
    const dto: UpdateFilmDto = {
      uuid: uuid,
      description: restDto.description
    }
    return await this.filmService.update(
      dto,
      restDto.login,
      restDto.password,
    );
  }
}
