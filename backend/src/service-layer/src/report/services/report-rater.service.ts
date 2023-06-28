import {Inject, Injectable} from "@nestjs/common";
import {RateBody, RateOption, RateOptionCheckCode, RateOptionCheckResult, RateResult, Report} from "../../../../domain";
import {UnknownInstanceException} from "../../../../exceptions";
import {REPORT_CONFIGURATION_TOKEN} from "../consts";
import {BaseConfiguration} from '../../../../config';
import {ReportConfig} from '../report.config';

@Injectable()
export class ReportRaterService {

  public constructor(
    @Inject(REPORT_CONFIGURATION_TOKEN)
    private readonly configuration: BaseConfiguration<ReportConfig>,
    private readonly rateOptions: RateOption[],
  ) {}

  public rate(bodyOrReport: RateBody | Report): RateResult {
    let body: RateBody;

    if (bodyOrReport instanceof Report) {
      body = new RateBody(
        bodyOrReport.content,
        bodyOrReport.plotRate,
        bodyOrReport.actorPlayRate,
      );
    } else if (bodyOrReport instanceof RateBody) {
      body = bodyOrReport;
    } else {
      throw new UnknownInstanceException('Invalid instance: should be RateBody or Report');
    }
    return this.calcRating(body);
  }

  private calcRating(body: RateBody): RateResult {
    const {
      defaultValue
    } = this.configuration.getConfig();
    const checkResults: RateOptionCheckResult[] = [];
    let rating = defaultValue;
    let maxRating = defaultValue;

    for (const rateOption of this.rateOptions) {
      const res = rateOption.check(body);
      if (res.code === RateOptionCheckCode.SUCCESS) {
        rating += res.givingScores;
      }
      maxRating += res.givingScores;
      checkResults.push(res);
    }
    const percentage = Math.floor(rating / maxRating * 100);
    return new RateResult(
      percentage,
      maxRating,
      checkResults,
    );
  }
}
