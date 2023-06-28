import {generateUuid} from "../../type-utils";

export class User {
  public constructor(
    public login: string,
    public password: string,
  ) {
    this.uuid = generateUuid();
  }
  public uuid: string;
}
