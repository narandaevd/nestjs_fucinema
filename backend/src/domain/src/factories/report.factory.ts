import {CreateReportDto} from "../dtos/report";
import {Report, ReportOptionalProps} from "../models/report";

export class ReportFactory {

  static create(
    content: string,
    optionalProps?: ReportOptionalProps
  ): Report {
    const r: Report = new Report(content);
    for (const prop in optionalProps) 
      r[prop] = optionalProps[prop];
    return r;
  }

  static createFromDto(dto: CreateReportDto): Report {
    const actualOptionalProps: ReportOptionalProps = Object
      .assign<ReportOptionalProps, CreateReportDto>(new Report(dto.content), dto);

    const r = this.create(
      dto.content,
      actualOptionalProps
    );
    return r;
  }
}
