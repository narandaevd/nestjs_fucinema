export interface IErrorService {
  logAndThrowIfConnectionRefused(exc: unknown): Promise<void>;
  logAndThrowIfUnknown(exc: unknown): Promise<void>;
}
