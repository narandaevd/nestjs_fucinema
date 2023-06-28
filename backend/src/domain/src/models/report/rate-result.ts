import {RateOptionCheckResult} from "./rate-options";

export class RateResult {
  public constructor(
    public readonly rating: number,
    public readonly maxRating: number,
    public readonly checkResults: RateOptionCheckResult[],
  ) {}
}
