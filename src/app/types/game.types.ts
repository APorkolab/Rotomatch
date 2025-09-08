// Game state enums
export enum GameState {
  IDLE = 'idle',
  PLAYING = 'playing',
  PAUSED = 'paused',
  WON = 'won',
  LOADING = 'loading'
}

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum CardState {
  FACE_DOWN = 'face_down',
  FACE_UP = 'face_up',
  MATCHED = 'matched',
  ANIMATING = 'animating'
}

// Core interfaces
export interface ICard {
  readonly id: number | string;
  readonly name: string;
  readonly icon: string;
  readonly category?: string;
  flipped: boolean;
  matched: boolean;
  backColor?: string;
  state: CardState;
}

export interface IGameSettings {
  deckSize: number;
  difficulty: GameDifficulty;
  enableSound: boolean;
  enableAnimations: boolean;
  autoSave: boolean;
  theme: string;
}

export interface IGameStats {
  readonly gameId: string;
  readonly startTime: Date;
  endTime?: Date;
  attempts: number;
  matches: number;
  bestTime?: number;
  completionPercentage: number;
  difficulty: GameDifficulty;
  deckSize: number;
}

export interface IGameSession {
  readonly id: string;
  cards: ICard[];
  stats: IGameStats;
  settings: IGameSettings;
  state: GameState;
  flippedCards: ICard[];
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface IBestScores {
  [deckSize: number]: {
    attempts: number;
    time: number;
    date: Date;
    difficulty: GameDifficulty;
  };
}

export interface IGameError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
}

// API Response types
export interface ILoadCardsResponse {
  cards: ICard[];
  success: boolean;
  error?: IGameError;
}

// Event interfaces
export interface ICardFlipEvent {
  card: ICard;
  position: number;
  timestamp: Date;
}

export interface IGameWonEvent {
  stats: IGameStats;
  newBestScore: boolean;
}

// Configuration interfaces
export interface IAppConfig {
  game: {
    minDeckSize: number;
    maxDeckSize: number;
    flipAnimationDuration: number;
    matchAnimationDuration: number;
    cardRevealTimeout: number;
  };
  api: {
    cardsEndpoint: string;
    retryAttempts: number;
    timeout: number;
  };
  storage: {
    gameStateKey: string;
    bestScoresKey: string;
    settingsKey: string;
  };
}

// Utility types
export type CardPair = [ICard, ICard];
export type GameCallback = (state: GameState) => void;
export type ErrorHandler = (error: IGameError) => void;

// Constants
export const DECK_SIZE_OPTIONS = [4, 6, 8, 10, 12, 14, 16, 18, 20] as const;
export type DeckSize = typeof DECK_SIZE_OPTIONS[number];

export const THEMES = ['default', 'dark', 'colorful', 'minimal'] as const;
export type Theme = typeof THEMES[number];
