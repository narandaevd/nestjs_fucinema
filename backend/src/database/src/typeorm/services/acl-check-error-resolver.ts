import {Injectable} from "@nestjs/common";
import {BackendHasntPermissionsException, DatabaseIsReadonlyException} from "../../../../exceptions/dist";
import {QueryFailedError} from "typeorm";
import {ECONNREFUSED} from "../consts";
import { IAclCheckErrorResolver } from "../interfaces/acl-check-error-resolver.interface";
import {PostgresError} from 'pg-error-enum';

@Injectable()
export class AclCheckErrorResolver implements IAclCheckErrorResolver {
  public constructor() {}

  assertThatHasPermissions(err: unknown): void {
    if (
      err instanceof QueryFailedError &&
      (err as any).code === PostgresError.INSUFFICIENT_PRIVILEGE
    ) 
      throw new BackendHasntPermissionsException();

    if (
      err instanceof QueryFailedError &&
      (err as any).code === PostgresError.READ_ONLY_SQL_TRANSACTION
    )
      throw new DatabaseIsReadonlyException();
  }
}
