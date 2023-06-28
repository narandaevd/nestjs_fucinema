import {User} from "../user";
import { generateUuid } from '../../type-utils';

export class Report {
  public constructor(
    public content: string,
  ) {
    this.uuid = generateUuid();
  }
  uuid: string;

  rate?: number;
  filmUuid?: string;
  userUuid?: string;
  user?: User;
  plotRate?: number;
  actorPlayRate?: number;
}

export type ReportOptionalProps = {
  [Property in keyof Omit<
    Report,
    "uuid" |
    "content"
  >]: Report[Property];
}
