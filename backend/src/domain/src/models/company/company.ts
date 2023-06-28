import {generateUuid} from "../../type-utils";

export class Company {
  public constructor(
    public title: string
  ) {
    this.uuid = generateUuid();
  }
  uuid: string;
  country?: string;
};
