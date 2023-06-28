import {Body, Controller, Post} from "@nestjs/common";
import {API_V1} from "../consts";
import { 
  ReportService
} from '../../../service-layer';
import {PutReportDto} from "../../../domain";
import {PutReportRestDto} from "../dtos/put-report.rest-dto";

@Controller(`${API_V1}/reports`)
export class ReportController {
  public constructor(
    private readonly reportService: ReportService,
  ) {}

  @Post()
  async put(@Body() restDto: PutReportRestDto) {
    const dto: PutReportDto = {...restDto};
    return await this.reportService.put(
      dto,
      restDto.login,
      restDto.password,
    );
  }
}
