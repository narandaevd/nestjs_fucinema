import {Actor} from "../actor/actor";
import {generateUuid} from "../../type-utils";
import {Company} from "../company/company";
import {Report} from "../report";

export class Film {
  public constructor(
    public title: string,
  ) {
    this.uuid = generateUuid();
  }
  uuid: string;
  description?: string;
  company?: Company;
  actors?: Actor[];
  reports?: Report[];
}
