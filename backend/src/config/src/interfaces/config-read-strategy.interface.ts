export interface IConfigReadStrategy {
  read(filePath: string): unknown;
}
