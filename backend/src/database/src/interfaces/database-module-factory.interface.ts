import {DatabaseConfig} from "../database.config";
import {DynamicModule} from "@nestjs/common";

export interface IDatabaseModuleFactory {
  create(config: DatabaseConfig): DynamicModule;
}
