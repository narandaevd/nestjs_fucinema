import {RateBody} from "../rate-body";
import {RateOption, RateOptionCheckCode, RateOptionCheckResult} from "./rate-option";

export class ActorPlayRateOption extends RateOption {
  constructor(givingScores: number) {
    super(givingScores);
  }
  check(body: RateBody): RateOptionCheckResult {
    if (body.actorPlayRate != null)
      return new RateOptionCheckResult(
        RateOptionCheckCode.SUCCESS,
        this.givingScores,
      );
    return new RateOptionCheckResult(
      RateOptionCheckCode.FAILURE,
      this.givingScores,
      'Игра актёров не была оценена'
    );
  }
}
