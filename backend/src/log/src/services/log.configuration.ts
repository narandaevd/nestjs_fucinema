import {Injectable} from "@nestjs/common";
import { BaseConfiguration } from '../../../config';
import {LogConfig} from "../log.config";

@Injectable()
export class LogConfiguration extends BaseConfiguration<LogConfig> {}
