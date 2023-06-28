export class Log {
  public constructor(
    objOrErr: unknown,
    public readonly message?: string | string[],
  ) {
    if (objOrErr instanceof Error)
      this.err = objOrErr;
    else
      this.payload = objOrErr;
    if (message?.length || message)
      this.message = message;
  }
  public err?: Error;
  public payload?: unknown;
}
