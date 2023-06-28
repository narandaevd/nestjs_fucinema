import {Injectable} from "@nestjs/common";
import {ReportConfig} from "../report.config";
import {BaseConfiguration} from "../../../../config";

@Injectable()
export class ReportConfiguration extends BaseConfiguration<ReportConfig> {}
