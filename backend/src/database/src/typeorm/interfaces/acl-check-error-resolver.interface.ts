export interface IAclCheckErrorResolver {
  assertThatHasPermissions(err: unknown): void;
}
