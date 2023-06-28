import {RateBody} from "../rate-body";
import {RateOption, RateOptionCheckCode, RateOptionCheckResult} from "./rate-option";

export class ContentLengthRateOption extends RateOption {
  constructor(
    givingScores: number, 
    private length: number,
  ) {
    super(givingScores);
  }

  check(body: RateBody): RateOptionCheckResult {
    if (body.content.length >= this.length) {
      return new RateOptionCheckResult(
        RateOptionCheckCode.SUCCESS,
        this.givingScores
      );
    }
    return new RateOptionCheckResult(
      RateOptionCheckCode.FAILURE,
      this.givingScores,
      `Длина содержимого мала. Не хватает ${
        this.length - body.content.length
      } символов`
    );
  }
}
