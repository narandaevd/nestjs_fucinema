export interface IProfanityChecker {
  isContainsProfanityWord(content: string, profanityWord: string): boolean;
  isContainsAnyProfanityWord(content: string, profanityWords: string[]): boolean;
  findAllProfanityWords(content: string, profanityWords: string[]): string[];
}
