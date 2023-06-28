export interface IConnectionRefusedResolver {
  throwIfConnectionRefused(err: unknown): void;
}
