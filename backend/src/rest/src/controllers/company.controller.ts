import {Body, Controller, Delete, Get, Patch, Post, Version} from "@nestjs/common";
import {Company, Role} from "../../../domain";
import {ApiWebServerIsDownResponse, AuthorizedUserHasRoles, Skip, Take, UuidParam} from "../decorators";
import {CompanyService} from "../../../service-layer";
import {CreateCompanyRestV2Dto, UpdateCompanyRestV2Dto} from "../dtos";
import {IPagination} from "../../../repository-contracts";
import { COMPANIES_TAG } from "../consts";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags(COMPANIES_TAG)
@AuthorizedUserHasRoles(Role.Admin)
@Controller()
export class CompanyController {
  public constructor(
    private readonly companyService: CompanyService,
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
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiWebServerIsDownResponse()
  @Get(COMPANIES_TAG)
  @Version('2')
  public async get(
    @Skip() skip: number,
    @Take() take: number
  ): Promise<IPagination<Company>> {
    return this.companyService.getMany(skip || 0, take || 10);
  }

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiWebServerIsDownResponse()
  @Post(COMPANIES_TAG)
  @Version('2')
  public async create(
    @Body() dto: CreateCompanyRestV2Dto,
  ): Promise<Company> {
    return await this.companyService.create(dto.title, dto.country);
  }

  @ApiParam({
    name: 'uuid',
    type: () => String,
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiWebServerIsDownResponse()
  @Patch(`${COMPANIES_TAG}/:uuid`) 
  @Version('2')
  public async update(
    @UuidParam() uuid: string,
    @Body() dto: UpdateCompanyRestV2Dto,
  ): Promise<Company> {
    return await this.companyService.update( 
      uuid,
      dto.title,
      dto.country,
    );
  }

  @ApiParam({
    name: 'uuid',
    type: () => String,
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiWebServerIsDownResponse()
  @Delete(`${COMPANIES_TAG}/:uuid`)
  @Version('2')
  public async delete(
    @UuidParam() uuid: string,
  ): Promise<void> {
    await this.companyService.delete(uuid);
  }
}
