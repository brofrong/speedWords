export type Experiment = {
  id: number;
  title: string;
  createdAt: Date;
};

export type ExperimentDto = {
  title: string;
  words: { id: string; word: string }[];
  examples: string[];
};

export type Words = {
  words: { id: string; word: string }[];
  examples: string[];
};

export type Answer = {
  user: string;
  word_id: string;
  word: string;
  answer: string;
  start_time: number;
  end_time: number;
  delta: number;
  training: boolean;
};
