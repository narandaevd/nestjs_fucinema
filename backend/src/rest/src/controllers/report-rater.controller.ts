import {
  IReportRaterService,
  REPORT_RATER_SERVICE_TOKEN, 
} from '../../../service-layer';
import {RateBody} from "../../../domain";

import {RateRestDto, RatingRestV2Dto} from "../dtos";
import {Body, Controller, Get, Inject, Post, Query, Version} from "@nestjs/common";
import { RATING_TAG } from '../consts';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWebServerIsDownResponse } from '../decorators';

@ApiTags(RATING_TAG)
@Controller()
export class ReportRaterController {
  public constructor(
    @Inject(REPORT_RATER_SERVICE_TOKEN)
    private readonly reportRaterService: IReportRaterService,
  ) {}

  @ApiOperation({
    summary: 'Получение оценки на отзыв',
  })
  @Version('1')
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiWebServerIsDownResponse()
  @Post('rate')
  rate(@Body() rateRestDto: RateRestDto) {
    const rateBody = new RateBody(
      rateRestDto.content,
      rateRestDto.plotRate,
      rateRestDto.actorPlayRate,
    );
    return this.reportRaterService.rate(rateBody);
  }

  @ApiOperation({
    summary: 'Получение оценки на отзыв',
  })  
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiWebServerIsDownResponse()
  @Version('2')
  @Get(RATING_TAG)
  getRatingByContent(@Query() dtoFromQuery: RatingRestV2Dto) {
    const rateBody = new RateBody(
      dtoFromQuery.content,
      dtoFromQuery.plotRate,
      dtoFromQuery.actorPlayRate,
    );
    return this.reportRaterService.rate(rateBody);
  }
}
