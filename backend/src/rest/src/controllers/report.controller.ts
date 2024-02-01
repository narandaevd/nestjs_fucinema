import {Body, Controller, Post, UseGuards, Version} from "@nestjs/common";
import {REPORTS_TAG} from "../consts";
import { 
  ReportService
} from '../../../service-layer';
import {PutReportDto} from "../../../domain";
import {PutReportRestDto} from "../dtos/put-report.rest-dto";
import { AuthGuard } from "../guards/auth.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PutReportRestV2Dto } from "../dtos";
import { ApiWebServerIsDownResponse, CurrentUser } from "../decorators";
import { UserFromToken } from "../interfaces/user-from-token";

@ApiTags(REPORTS_TAG)
@Controller()
export class ReportController {
  public constructor(
    private readonly reportService: ReportService,
  ) {}

  @ApiOperation({
    summary: 'Оставить отзыв к фильму',
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiWebServerIsDownResponse()
  @ApiCreatedResponse()
  @Version('1')
  @Post(REPORTS_TAG)
  async putV1(@Body() restDto: PutReportRestDto) {
    const dto: PutReportDto = {...restDto};
    return await this.reportService.put(
      dto,
      restDto.login,
      restDto.password,
    );
  }

  @ApiOperation({
    summary: 'Оставить отзыв к фильму',
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiWebServerIsDownResponse()
  @ApiCreatedResponse()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Version('2')
  @Post(REPORTS_TAG)
  async putV2(
    @Body() restDto: PutReportRestV2Dto,
    @CurrentUser() user: UserFromToken,
  ) {
    const dto: PutReportDto = {
      ...restDto,
      userUuid: user.userId,
    };
    return await this.reportService.put(
      dto,
      user.login,
      user.sensitiveInfo.password,
    );
  }
}
