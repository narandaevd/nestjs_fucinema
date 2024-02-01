import {Body, Controller, Delete, Get, Patch, Post, Version} from "@nestjs/common";
import {ApiWebServerIsDownResponse, AuthorizedUserHasRoles, CurrentUser, UuidParam} from "../decorators";
import {Actor, Role, User} from "../../../domain";
import {ActorService} from "../../../service-layer";
import {CreateActorRestV2Dto, UpdateActorRestV2Dto} from "../dtos";
import {IPagination} from "../../../repository-contracts";
import {Skip, Take} from "../decorators";
import { ACTORS_TAG } from "../consts";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags(ACTORS_TAG)
@AuthorizedUserHasRoles(Role.Admin)
@Controller()
export class ActorController {
  public constructor(
    private readonly actorService: ActorService,
  ) {}

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
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiWebServerIsDownResponse()
  @Get(ACTORS_TAG)
  @Version('2')
  public async get(
    @Skip() skip: number,
    @Take() take: number
  ): Promise<IPagination<Actor>> {
    return this.actorService.getMany(skip || 0, take || 10);
  }

  @ApiCreatedResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiWebServerIsDownResponse()
  @Post(ACTORS_TAG)
  @Version('2')
  public async create(
    @Body() dto: CreateActorRestV2Dto,
  ): Promise<Actor> {
    return await this.actorService.create(
      dto.firstName,
      dto.lastName,
      dto.middleName,
      dto.country,
    );
  }

  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiWebServerIsDownResponse()
  @ApiParam({
    name: 'uuid',
    type: () => String,
  })
  @Patch(`${ACTORS_TAG}/:uuid`)
  @Version('2')
  public async update(
    @Body() dto: UpdateActorRestV2Dto,
    @UuidParam() uuid: string
  ): Promise<Actor> {
    return await this.actorService.update(
      uuid,
      dto.firstName,
      dto.lastName,
      dto.middleName,
      dto.country,
    )
  }

  @ApiParam({
    name: 'uuid',
    type: () => String,
  })
  @ApiNoContentResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @Delete(`${ACTORS_TAG}/:uuid`)
  @Version('2')
  public async delete(
    @UuidParam() uuid: string
  ): Promise<void> {
    await this.actorService.delete(uuid);
  }
}
