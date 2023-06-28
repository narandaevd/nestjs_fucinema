import {IConfigReadStrategy} from "../interfaces/config-read-strategy.interface";
import {load} from 'js-yaml';
import fs from 'fs';

export class YamlReadStrategy implements IConfigReadStrategy {
  private parseYml(filePath: string): unknown {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return load(content);
    } catch (e) {
      const SETTINGS_PARSING_ERROR = '\n\nSETTINGS PARSING ERROR';
      console.error(`${SETTINGS_PARSING_ERROR} ${filePath}`);
      console.error(e);
      process.exit(1);
    }
  }

  read(filePath: string): unknown {
    return this.parseYml(filePath);
  }
}
