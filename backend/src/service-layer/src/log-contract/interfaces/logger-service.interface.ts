export interface ILogService {
  warning(objOrErr: unknown, content?: string | string[]): Promise<void>;
  fatal(objOrErr: unknown, content?: string | string[]): Promise<void>;
  debug(objOrErr: unknown, content?: string | string[]): Promise<void>;
  info(objOrErr: unknown, content?: string | string[]): Promise<void>;
  danger(objOrErr: unknown, content?: string | string[]): Promise<void>;
}
