import {
  ILogService,
  LOG_SERVICE
} from "../../log-contract";
import {DatabaseConnectionRefusedException, UnknownException} from "../../../../exceptions";

import {Inject, Injectable} from "@nestjs/common";
import {IErrorService} from "../interfaces/error-service.interface";

@Injectable()
export class ErrorService implements IErrorService {
  public constructor(
    @Inject(LOG_SERVICE)
    private readonly logService: ILogService
  ) {}

  public async logAndThrowIfUnknown(exc: unknown): Promise<void> {
    if (exc instanceof UnknownException && exc.code === UnknownException.code) {
      await this.logService.fatal(exc);
      throw exc;
    }
  }

  public async logAndThrowIfConnectionRefused(exc: unknown): Promise<void> {
    if (exc instanceof DatabaseConnectionRefusedException && exc.code === DatabaseConnectionRefusedException.code) {
      await this.logService.fatal(exc);
      throw exc;
    }
  }
}
