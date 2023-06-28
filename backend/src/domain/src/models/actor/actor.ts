import {generateUuid} from "../../type-utils";

export class Actor {
  public constructor(
    public firstName: string,
    public lastName: string,
  ) {
    this.uuid = generateUuid();
  }
  
  uuid: string;
  middleName?: string;
  country?: string;
};
