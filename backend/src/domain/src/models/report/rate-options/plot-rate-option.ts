import {RateBody} from "../rate-body";
import {RateOption, RateOptionCheckCode, RateOptionCheckResult} from "./rate-option";

export class PlotRateOption extends RateOption {
  constructor(givingScores: number) {
    super(givingScores);
  }
  check(body: RateBody): RateOptionCheckResult {
    if (body.plotRate != null)
      return new RateOptionCheckResult(
        RateOptionCheckCode.SUCCESS,
        this.givingScores,
      );
    return new RateOptionCheckResult(
      RateOptionCheckCode.FAILURE,
      this.givingScores,
      'Сюжет не был оценён'
    );
  }
}
