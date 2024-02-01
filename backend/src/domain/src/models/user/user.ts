import {generateUuid} from "../../type-utils";
import { Role } from "../types";

export class User {
  public constructor(
    public login: string,
    public password: string,
  ) {
    this.uuid = generateUuid();
    this.roles = [];
  }
  public uuid: string;

  public roles: Role[];
}
