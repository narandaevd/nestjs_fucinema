import {IConfigReadStrategy} from "../interfaces/config-read-strategy.interface";

export abstract class BaseConfiguration<TConfig> {
  protected readStrat: IConfigReadStrategy;
  protected config: TConfig;

  public constructor(st: IConfigReadStrategy) {
    this.readStrat = st;
  };
  readConfig(configFilePath: string): void {
    this.config = this.readStrat.read(configFilePath) as TConfig;
  };
  getConfig(): TConfig {
    return this.config;
  }
}
