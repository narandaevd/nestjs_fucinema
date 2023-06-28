import {Injectable} from "@nestjs/common";
import {BaseConfiguration} from "../../../../config";
import {UserConfig} from "../user.config";

@Injectable()
export class UserConfiguration extends BaseConfiguration<UserConfig> {};
