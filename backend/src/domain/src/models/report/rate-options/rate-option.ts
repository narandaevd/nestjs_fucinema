import {RateBody} from "../rate-body";

export enum RateOptionCheckCode {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export class RateOptionCheckResult {
  constructor (
    public readonly code: RateOptionCheckCode,
    public readonly givingScores: number,
    failureMessage?: string,
  ) {
    if (failureMessage)
      this.failureMessage = failureMessage;
  }

  public readonly failureMessage?: string;
}

export abstract class RateOption {
  constructor(
    protected givingScores: number,
  ) {}
  abstract check(body: RateBody): RateOptionCheckResult;
}
