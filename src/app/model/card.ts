import { ICard, CardState } from '../types/game.types';

/**
 * Card implementation class
 */
export class Card implements ICard {
  public readonly id: number | string;
  public readonly name: string;
  public readonly icon: string;
  public readonly category?: string;
  public flipped: boolean = false;
  public matched: boolean = false;
  public backColor?: string;
  public state: CardState = CardState.FACE_DOWN;

  public constructor(data: Partial<ICard> & { id: number | string; name: string; icon: string }) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.category = data.category;
    this.flipped = data.flipped ?? false;
    this.matched = data.matched ?? false;
    this.backColor = data.backColor;
    this.state = data.state ?? CardState.FACE_DOWN;
  }

  /**
   * Creates a copy of the card with updated properties
   */
  public clone(updates?: Partial<Omit<ICard, 'id' | 'name' | 'icon' | 'category'>>): Card {
    return new Card({
      ...this,
      ...updates
    });
  }

  /**
   * Flips the card and updates its state
   */
  public flip(): Card {
    return this.clone({
      flipped: !this.flipped,
      state: this.flipped ? CardState.FACE_DOWN : CardState.FACE_UP
    });
  }

  /**
   * Marks the card as matched
   */
  public markAsMatched(): Card {
    return this.clone({
      matched: true,
      flipped: true,
      state: CardState.MATCHED
    });
  }

  /**
   * Resets the card to face down state
   */
  public reset(): Card {
    return this.clone({
      flipped: false,
      matched: false,
      state: CardState.FACE_DOWN
    });
  }

  /**
   * Checks if this card matches another card
   */
  public matches(other: ICard): boolean {
    return this.name === other.name && this.id !== other.id;
  }

  /**
   * Checks if the card is in a clickable state
   */
  public isClickable(): boolean {
    return !this.flipped && !this.matched && this.state !== CardState.ANIMATING;
  }
}
