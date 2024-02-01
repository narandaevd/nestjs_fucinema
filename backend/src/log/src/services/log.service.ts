import {ILogService} from "../../../service-layer";

import {Injectable} from "@nestjs/common";
import pino, {Logger} from "pino";
import {LogConfig} from "../log.config";
import {Log} from '../log';
import * as path from 'path';

@Injectable()
export class PinoLogService implements ILogService {
  public constructor(
    private readonly config: LogConfig,
  ) {
    this.pino = pino({
      level: 'trace',
      transport: {
        target: 'pino-pretty',
        options: {
          destination: path.resolve(__dirname, this.config.logPath)
        }
      }
    });
  }
  pino: Logger;

  async fatal(objOrErr: unknown, content?: string|string[]): Promise<void> {
    // this.pino.fatal(new Log(objOrErr, content));
  }

  async warning(objOrErr: unknown, content?: string | string[]): Promise<void> {
    // this.pino.warn(new Log(objOrErr, content));
  }

  async debug(objOrErr: unknown, content?: string | string[]): Promise<void> {
    // this.pino.debug(new Log(objOrErr, content));
  }

  async info(objOrErr: unknown, content?: string | string[]): Promise<void> {
    // this.pino.info(new Log(objOrErr, content));
  }

  async danger(objOrErr: unknown, content?: string | string[]): Promise<void> {
    // this.pino.error(new Log(objOrErr, content));
  }
}
