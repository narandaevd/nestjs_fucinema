import {Injectable} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DatabaseConnectionRefusedException} from "../../../../exceptions/dist";

import {QueryFailedError} from "typeorm";
import {ECONNREFUSED} from "../consts";
import {IConnectionRefusedResolver} from "../interfaces/connection-refused-resolver.interface";

@Injectable()
export class ConnectionRefusedResolver implements IConnectionRefusedResolver {
  public constructor() {}

  throwIfConnectionRefused(err: unknown): void {
    const CON_TERMINATED_DUE_TO_ADMIN_COMMAND_ERRCODE = '57P01'
    if (
      err instanceof QueryFailedError &&
      err.message === 'Connection terminated unexpectedly' ||
      (err as any).code === CON_TERMINATED_DUE_TO_ADMIN_COMMAND_ERRCODE ||
      (err as any).code === ECONNREFUSED
    ) 
      throw new DatabaseConnectionRefusedException();
  }
}
