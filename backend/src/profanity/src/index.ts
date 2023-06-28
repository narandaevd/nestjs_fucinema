import { IProfanityChecker } from '../../domain';

export class ProfanityChecker implements IProfanityChecker {
  public isContainsProfanityWord(content: string, profanityWord: string): boolean {
    return content.includes(profanityWord);
  }

  public isContainsAnyProfanityWord(content: string, profanityWords: string[]): boolean {
    for (let profanityWord of profanityWords)
      if (this.isContainsProfanityWord(content, profanityWord))
        return true;
    return false;
  }

  public findAllProfanityWords(content: string, profanityWords: string[]): string[] {
    const profanityWordsInContent: string[] = [];
    for (let profanityWord of profanityWords)
      if (this.isContainsProfanityWord(content, profanityWord))
        profanityWordsInContent.push(profanityWord);
    return profanityWordsInContent;
  }
}
