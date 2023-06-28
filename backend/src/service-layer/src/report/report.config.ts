class RatingOptionConfig<T = {}> {
  givingScores: number;
  payload: T;
}

export class ReportConfig {
  defaultValue: number;
  plotRate: RatingOptionConfig;
  actorPlayRate: RatingOptionConfig;
  content: RatingOptionConfig<{length: number}>;
  noProfanity: RatingOptionConfig;
  services: {
    raterServiceType: string;
    profanityServiceType: string;
  };
  profanity: {
    list: string[];
  };
};
