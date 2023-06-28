import {
  IReportRaterService,
  REPORT_RATER_SERVICE_TOKEN, 
} from '../../../service-layer';
import {RateBody} from "../../../domain";

import {API_V1} from "../consts";
import {RateRestDto} from "../dtos";
import {Body, Controller, Inject, Post} from "@nestjs/common";

@Controller(`${API_V1}/rate`)
export class ReportRaterController {
  public constructor(
    @Inject(REPORT_RATER_SERVICE_TOKEN)
    private readonly reportRaterService: IReportRaterService,
  ) {}
  
  @Post()
  rate(@Body() rateRestDto: RateRestDto) {
    const rateBody = new RateBody(
      rateRestDto.content,
      rateRestDto.plotRate,
      rateRestDto.actorPlayRate,
    );
    return this.reportRaterService.rate(rateBody);
  }
}
