import {IProfanityChecker} from "../../../interfaces/profanity-checker.interface";
import {RateBody} from "../rate-body";
import {RateOption, RateOptionCheckCode, RateOptionCheckResult} from "./rate-option";

export class NoProfanityRateOption extends RateOption {
  constructor(
    givingScores: number,
    private profanity: string[],
    private profanityChecker: IProfanityChecker
  ) {
    super(givingScores);
  }

  check(body: RateBody): RateOptionCheckResult {
    const profanityWordsInContent = this
      .profanityChecker
      .findAllProfanityWords(body.content, this.profanity);

    if (profanityWordsInContent.length === 0)
      return new RateOptionCheckResult(
        RateOptionCheckCode.SUCCESS,
        this.givingScores,
      );
    const words = profanityWordsInContent.join(', ');
    return new RateOptionCheckResult(
      RateOptionCheckCode.FAILURE,
      this.givingScores,
      `Найдена ненормативная лексика в содержимом отзыва: \'${words}\'`
    );
  }
}
