import {Body, Controller, Delete, Get, MethodNotAllowedException, Patch, Post, Query, UseGuards, Version} from "@nestjs/common";
import {FILMS_TAG, HttpCodes} from "../consts";
import { FilmService } from '../../../service-layer';
import {Film, Role, UpdateFilmDto} from "../../../domain";
import {AddActorToFilmRestV2Dto, CreateFilmRestV2Dto, UpdateFilmRestDto, UpdateFilmRestV2Dto} from "../dtos";
import {ApiWebServerIsDownResponse, AuthorizedUserHasRoles, CurrentUser, HasRoles, Skip, Take, UuidParam} from "../decorators";
import {IFilmPagination} from "../../../repository-contracts";
import { AuthGuard } from "../guards/auth.guard";
import { UserFromToken } from "../interfaces/user-from-token";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RolesGuard } from "../guards/roles.guard";

@ApiTags(FILMS_TAG)
@Controller()
export class FilmController {
  public constructor(
    private readonly filmService: FilmService,
  ) {}

  @ApiOperation({
    summary: 'Получение списка фильмов',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    schema: {
      default: 0,
    }
  })
  @ApiQuery({
    name: 'take',
    required: false,
    schema: {
      default: 10,
    }
  })
  @Version('1')
  @Get(FILMS_TAG)
  @ApiWebServerIsDownResponse()
  @ApiOkResponse()
  async getFilmsV1(
    @Skip() skip: number,
    @Take() take: number,
  ): Promise<IFilmPagination> {
    return await this.filmService.getMany(skip, take);
  }

  @ApiOperation({
    summary: 'Получение списка фильмов по фильтрам',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    schema: {
      default: 0,
    }
  })
  @ApiQuery({
    name: 'title',
    required: false,
  })
  @ApiQuery({
    name: 'description',
    required: false,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    schema: {
      default: 10,
    }
  })
  @ApiWebServerIsDownResponse()
  @ApiOkResponse()
  @Version('2')
  @Get(FILMS_TAG)
  async getFilmsV2(
    @Skip() skip: number,
    @Take() take: number,
    @Query('title') title: string,
    @Query('description') description: string,
  ): Promise<IFilmPagination> {
    return await this.filmService.getMany(
      skip, 
      take,
      title,
      description,
    );
  }

  @ApiOperation({
    summary: 'Получение подробной информации о фильме',
  })  
  @ApiWebServerIsDownResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Version(['1', '2'])
  @Get(`${FILMS_TAG}/:uuid`)
  async getOneWithDetails(
    @UuidParam() uuid: string,
  ): Promise<Film> {
    return await this.filmService.getOneWithDetails(uuid);
  }

  @ApiOperation({
    summary: 'Изменение описания фильма',
  })
  @ApiWebServerIsDownResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Version('1')
  @Patch(`${FILMS_TAG}/:uuid`)
  async updateV1(
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

  @ApiOperation({
    summary: 'Изменение описания фильма',
  })
  @ApiWebServerIsDownResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @ApiOkResponse()
  @Version('2')
  @UseGuards(AuthGuard)
  @Patch(`${FILMS_TAG}/:uuid`)
  async updateV2(
    @UuidParam() uuid: string,
    @CurrentUser() user: UserFromToken,
    @Body() restDto: UpdateFilmRestV2Dto,
  ) {
    const dto: UpdateFilmDto = {
      uuid,
      description: restDto.description
    }
    return await this.filmService.update(
      dto,
      user.login,
      user.sensitiveInfo.password,
    );
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @Post(FILMS_TAG)
  @Version('2')
  @AuthorizedUserHasRoles(Role.Admin)
  async createFilmV2(
    @Body() dto: CreateFilmRestV2Dto,
  ) {
    return this.filmService.create(
      dto.title,
      dto.description,
      dto.companyUuid,
    );
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiParam({
    name: 'uuid',
    type: () => String,
  })
  @Delete(`${FILMS_TAG}/:uuid`)
  @Version('2')
  @AuthorizedUserHasRoles(Role.Admin)
  async deleteFilmV2(
    @UuidParam() filmUuid: string,
  ) {
    await this.filmService.delete(filmUuid);
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiParam({
    name: 'uuid',
    type: () => String,
  })
  @Post(`${FILMS_TAG}/:uuid/actors`)
  @Version('2')
  @AuthorizedUserHasRoles(Role.Admin)
  async addActorToFilmV2(
    @UuidParam() filmUuid: string,
    @Body() dto: AddActorToFilmRestV2Dto,
  ) {
    return this.filmService.addActorToFilm(filmUuid, dto.actorUuid);
  }
}
