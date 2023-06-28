export abstract class BaseException extends Error {
  constructor(
    public code: string,
    message: string | string[]
  ) {
    super();
    if (typeof message === 'string')
      this.message = message;
    else 
      this.messages = [...message];
    this.timestamp = new Date().toLocaleString();
  }

  public readonly timestamp: string;
  public readonly messages?: string[];
}
