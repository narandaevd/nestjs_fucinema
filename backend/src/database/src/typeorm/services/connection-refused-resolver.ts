import {Injectable} from "@nestjs/common";
import {DatabaseConnectionRefusedException} from "../../../../exceptions/dist";

import {QueryFailedError} from "typeorm";
import {ECONNREFUSED} from "../consts";
import {IConnectionRefusedResolver} from "../interfaces/connection-refused-resolver.interface";

import { PostgresError } from "pg-error-enum";

@Injectable()
export class ConnectionRefusedResolver implements IConnectionRefusedResolver {
  public constructor() {}

  throwIfConnectionRefused(err: unknown): void {
    if (
      err instanceof QueryFailedError &&
      err.message === 'Connection terminated unexpectedly' ||
      (err as any).code === PostgresError.ADMIN_SHUTDOWN ||
      (err as any).code === PostgresError.CRASH_SHUTDOWN ||
      (err as any).code === ECONNREFUSED
    ) 
      throw new DatabaseConnectionRefusedException();
  }
}
