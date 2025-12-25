
export interface Sentence {
  id: string;
  text: string;
  translation: string;
  pronunciationTips?: string[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  sentences: Sentence[];
}

export enum AppState {
  SELECTING_TOPIC = 'SELECTING_TOPIC',
  SELECTING_SENTENCE = 'SELECTING_SENTENCE',
  PRACTICING = 'PRACTICING'
}
