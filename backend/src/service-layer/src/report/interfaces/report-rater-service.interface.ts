import {RateBody, RateResult, Report} from "../../../../domain";

export interface IReportRaterService {
  rate(bodyOrReport: RateBody | Report): RateResult;
}
