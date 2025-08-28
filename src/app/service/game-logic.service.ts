import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Card } from '../model/card';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { GameStateService } from './game-state.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {
  private cardList = new BehaviorSubject<Card[]>([]);
  cardList$ = this.cardList.asObservable();

  private score = new BehaviorSubject<number>(0);
  score$ = this.score.asObservable();

  private isProcessing = new BehaviorSubject<boolean>(false);
  isProcessing$ = this.isProcessing.asObservable();

  private gameWon = new Subject<void>();
  gameWon$ = this.gameWon.asObservable();

  private twoCard: Card[] = [];
  private counter = 0;
  private deckSize = 0;

  private allCards: Card[] = [];
  private readonly CARDS_JSON_PATH = 'assets/data/cards.json';

  constructor(
    private notification: NotificationService,
    private router: Router,
    private data: GameStateService,
    private http: HttpClient
  ) {
    this.loadAllCards();
  }

  private loadAllCards(): void {
    this.http.get<Card[]>(this.CARDS_JSON_PATH).subscribe({
      next: (cards) => {
        this.allCards = cards;
      },
      error: (err) => {
        console.error('Failed to load card data', err);
        this.notification.showError('Could not load game assets. Please refresh the page.', 'Error');
      }
    });
  }

  public newGame(deckSize: number): void {
    if (this.allCards.length === 0) {
        this.notification.showError('Game data is not loaded yet. Please wait a moment.', 'Matching Game');
        return;
    }
    this.deckSize = deckSize;
    if (!this.isValidDeckSize(this.deckSize)) {
      this.notification.showError('There is no valid data for deck size. Please, reset the application.', 'Matching Game');
      this.router.navigate(['/']);
      return;
    }

    this.localStorageClear();
    this.score.next(0);
    this.twoCard = [];
    this.shuffleCards(this.deckSize);
    this.isProcessing.next(false);
  }

  public revealCard(selectedCard: Card): void {
    if (this.isProcessing.value || selectedCard.flipped || this.counter >= 2) {
      return;
    }

    const currentCards = this.cardList.value;
    const cardInDeck = currentCards.find(c => c.id === selectedCard.id);

    if (cardInDeck && !cardInDeck.flipped) {
      cardInDeck.flipped = true;
      this.twoCard.push(cardInDeck);
      this.counter++;
      this.cardList.next([...currentCards]);
    }

    if (this.counter === 2) {
      this.isProcessing.next(true);
      this.checkCards();
    }
  }

  private isValidDeckSize(deckSize: number): boolean {
    return deckSize > 0 && deckSize % 2 === 0 && deckSize <= this.allCards.length * 2;
  }

  private shuffleCards(deckSize: number): void {
    let selectedCards: Card[] = [];
    const availableCards = [...this.allCards];

    for (let i = 0; i < deckSize / 2; i++) {
      const card = { ...availableCards[i % availableCards.length] };
      selectedCards.push(card);
      selectedCards.push({ ...card, id: (card.id as number) + 10000 });
    }

    for (let i = selectedCards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [selectedCards[i], selectedCards[randomIndex]] = [selectedCards[randomIndex], selectedCards[i]];
    }

    this.cardList.next(selectedCards.map(card => ({ ...card, flipped: false, matched: false })));
    this.data.changeNewGameWanted(false);
  }

  private checkCards(): void {
    if (this.twoCard.length !== 2) return;

    this.score.next(this.score.value + 1);

    const [card1, card2] = this.twoCard;
    if (card1.name === card2.name && card1.id !== card2.id) {
      this.setCardsToMatched(card1, card2);
    } else {
      this.flipCardsBack();
    }
    this.localStorageStore(this.cardList.value);
  }

  private setCardsToMatched(card1: Card, card2: Card): void {
    const currentCards = this.cardList.value.map(card => {
      if (card.id === card1.id || card.id === card2.id) {
        return { ...card, matched: true, flipped: true };
      }
      return card;
    });

    this.cardList.next(currentCards);
    this.checkGameStatus();
    this.resetTurn();
  }

  private flipCardsBack(): void {
    setTimeout(() => {
      const currentCards = this.cardList.value.map(card => {
        if (!card.matched && (card.id === this.twoCard[0].id || card.id === this.twoCard[1].id)) {
          return { ...card, flipped: false };
        }
        return card;
      });
      this.cardList.next(currentCards);
      this.resetTurn();
    }, 1500);
  }

  private resetTurn(): void {
    this.twoCard = [];
    this.counter = 0;
    this.isProcessing.next(false);
  }

  private checkGameStatus(): void {
    const allMatched = this.cardList.value.every(card => card.matched);
    if (allMatched && this.cardList.value.length > 0) {
      this.gameWon.next();
      this.notification.showSuccess('You have won! Click the restart button for a new game.', 'Matching Game');
      this.updateBestResult(this.score.value);
    }
  }

  // --- Local Storage Logic ---

  private updateBestResult(currentResult: number): void {
    const bestResults = this.loadBestResults();
    if (currentResult > 0 && currentResult < (bestResults[this.deckSize] || Infinity)) {
      bestResults[this.deckSize] = currentResult;
      this.saveBestResults(bestResults);
    }
  }

  public loadBestResults(): { [key: number]: number } {
    const storedResults = localStorage.getItem('bestResults');
    if (storedResults) {
      return JSON.parse(storedResults);
    }
    const initialResults: { [key: number]: number } = {};
    for (let size = 2; size <= 20; size += 2) {
      initialResults[size] = Infinity;
    }
    return initialResults;
  }

  private saveBestResults(results: { [key: number]: number }): void {
    localStorage.setItem('bestResults', JSON.stringify(results));
  }

  private localStorageStore(cardList: Card[]): void {
    localStorage.setItem('cards', JSON.stringify(cardList));
  }

  private localStorageClear(): void {
    localStorage.removeItem('cards');
  }
}
