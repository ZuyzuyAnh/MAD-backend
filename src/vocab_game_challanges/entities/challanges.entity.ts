export interface WordMatchChallange {
  number: number;
  matches: {
    originalWords: string[];
    translatedWords: string[];
  }[];
}

export interface ScrambleAndListenChallange {
  number: number;
  words: string[];
}
