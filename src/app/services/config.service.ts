import { Injectable } from '@angular/core';
import { IAppConfig, GameDifficulty } from '../types/game.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config: IAppConfig = {
    game: {
      minDeckSize: 4,
      maxDeckSize: 20,
      flipAnimationDuration: 600,
      matchAnimationDuration: 1000,
      cardRevealTimeout: 1500
    },
    api: {
      cardsEndpoint: 'assets/data/cards.json',
      retryAttempts: 3,
      timeout: 10000
    },
    storage: {
      gameStateKey: 'rotomatch_game_state',
      bestScoresKey: 'rotomatch_best_scores',
      settingsKey: 'rotomatch_settings'
    }
  };

  public getConfig(): Readonly<IAppConfig> {
    return this.config;
  }

  public getGameConfig(): Readonly<IAppConfig['game']> {
    return this.config.game;
  }

  public getApiConfig(): Readonly<IAppConfig['api']> {
    return this.config.api;
  }

  public getStorageConfig(): Readonly<IAppConfig['storage']> {
    return this.config.storage;
  }

  public isValidDeckSize(size: number): boolean {
    return size >= this.config.game.minDeckSize &&
           size <= this.config.game.maxDeckSize &&
           size % 2 === 0;
  }

  public getDifficultySettings(difficulty: GameDifficulty): {
    cardRevealTimeout: number;
    maxAttempts?: number;
    timeLimit?: number;
  } {
    switch (difficulty) {
      case GameDifficulty.EASY:
        return {
          cardRevealTimeout: 2500,
          maxAttempts: undefined,
          timeLimit: undefined
        };
      case GameDifficulty.MEDIUM:
        return {
          cardRevealTimeout: 1500,
          maxAttempts: undefined,
          timeLimit: 300000 // 5 minutes
        };
      case GameDifficulty.HARD:
        return {
          cardRevealTimeout: 800,
          maxAttempts: Math.ceil(this.config.game.maxDeckSize * 1.5),
          timeLimit: 180000 // 3 minutes
        };
      default:
        return {
          cardRevealTimeout: this.config.game.cardRevealTimeout
        };
    }
  }

  public isProduction(): boolean {
    return environment.production;
  }

  public getVersion(): string {
    return '2.0.0';
  }
}
