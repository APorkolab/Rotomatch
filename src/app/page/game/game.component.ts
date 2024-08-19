import { NotificationService } from './../../service/notification.service';
import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/model/card';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/service/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  deckSize!: number;
  deckSizeSubscription!: Subscription;

  newGameWanted!: boolean;
  newGameWantedSubscription!: Subscription;

  cardList: Card[] = [];
  twoCard: Card[] = [];
  IsItStarted = false;
  ThereIsEndedGame = false;

  bestResults: { [key: number]: number } = {};
  currentResult = 0;
  counter = 0;
  isProcessing = false;

  listOfAllCard: Card[] = [
    {
      id: 1,
      name: 'Angular',
      icon: '../../../assets/images/cards/angular.png',
      flipped: false,
      matched: false,
    },
    {
      id: 3,
      name: 'D3',
      icon: '../../../assets/images/cards/d3.png',
      flipped: false,
      matched: false,
    },
    {
      id: 5,
      name: 'Jenkins',
      icon: '../../../assets/images/cards/jenkins.png',
      flipped: false,
      matched: false,
    },
    {
      id: 7,
      name: 'PostCss',
      icon: '../../../assets/images/cards/postcss.png',
      flipped: false,
      matched: false,
    },
    {
      id: 9,
      name: 'React',
      icon: '../../../assets/images/cards/react.png',
      flipped: false,
      matched: false,
    },
    {
      id: 11,
      name: 'Redux',
      icon: '../../../assets/images/cards/redux.png',
      flipped: false,
      matched: false,
    },
    {
      id: 13,
      name: 'SASS',
      icon: '../../../assets/images/cards/sass.png',
      flipped: false,
      matched: false,
    },
    {
      id: 15,
      name: 'Rotomatch',
      icon: '../../../assets/images/cards/rotomatch.png',
      flipped: false,
      matched: false,
    },
    {
      id: 17,
      name: 'TS',
      icon: '../../../assets/images/cards/ts.png',
      flipped: false,
      matched: false,
    },
    {
      id: 19,
      name: 'Webpack',
      icon: '../../../assets/images/cards/webpack.png',
      flipped: false,
      matched: false,
    },
  ];

  constructor(private notification: NotificationService, private data: CardService, private router: Router) { }

  ngOnInit(): void {
    this.deckSizeSubscription = this.data.currentSelectedDeckSize.subscribe(deckSize => {
      this.deckSize = deckSize;
      this.startGame();  // Automatikusan indítja a játékot, ha a deckSize megváltozik
    });
    this.newGameWantedSubscription = this.data.currentNewGameWanted.subscribe(isANewGameWanted => {
      this.newGameWanted = isANewGameWanted;
      if (isANewGameWanted) {
        this.restartGame();
      }
    });
    this.loadBestResults();
  }

  loadBestResults() {
    const storedResults = localStorage.getItem('bestResults');
    if (storedResults) {
      this.bestResults = JSON.parse(storedResults);
    } else {
      // Kezdeti értékek beállítása minden páros paklimérethez 2-től 20-ig
      for (let size = 2; size <= 20; size += 2) {
        this.bestResults[size] = Infinity;
      }
    }
  }

  saveBestResults() {
    localStorage.setItem('bestResults', JSON.stringify(this.bestResults));
  }

  startGame() {
    if (!this.isValidDeckSize(this.deckSize)) {
      this.notification.showError('There is no valid data for deck size. Please, reset the application or wait 2 seconds.', 'Matching Game v.1.0.0');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      return;
    }

    this.localStorageClear();
    this.twoCard = [];
    this.resetCards();
    this.shuffleCards(this.deckSize);
    this.IsItStarted = true;
    this.ThereIsEndedGame = false;
    this.isProcessing = false;
    this.currentResult = 0;
  }

  restartGame() {
    this.startGame();
  }

  isValidDeckSize(deckSize: number): boolean {
    return deckSize > 0 && deckSize % 2 === 0 && deckSize <= this.listOfAllCard.length * 2;
  }

  resetCards() {
    this.cardList.forEach(card => {
      card.flipped = false;
      card.matched = false;
    });
  }

  shuffleCards(deckSize: number) {
    let selectedCards: Card[] = [];

    for (let i = 0; i < deckSize / 2; i++) {
      const card = { ...this.listOfAllCard[i % this.listOfAllCard.length] };
      selectedCards.push(card);
      selectedCards.push({ ...card, id: (card.id as number) + 10000 });
    }

    for (let i = selectedCards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [selectedCards[i], selectedCards[randomIndex]] = [selectedCards[randomIndex], selectedCards[i]];
    }

    this.cardList = selectedCards.map(card => ({ ...card, flipped: false, matched: false }));
    this.data.changeNewGameWanted(false);
  }

  setCardToMatched(card1: Card, card2: Card) {
    this.cardList.forEach((card) => {
      if (card.id === card1.id || card.id === card2.id) {
        card.flipped = true;
        card.matched = true;
      }
    });
    this.checkGameStatus();
    this.counter = 0;
    this.twoCard = [];
    this.isProcessing = false;
  }

  flipCardsBack() {
    setTimeout(() => {
      this.hideTheCard();
      this.counter = 0;
      this.isProcessing = false;
    }, 1500);
  }

  revealTheCard(selectedCard: Card) {
    if (!this.IsItStarted || this.isProcessing || selectedCard.flipped || this.counter >= 2) {
      return;
    }
    if (this.twoCard.findIndex(card => card.id === selectedCard.id) === -1) {
      this.twoCard.push(selectedCard);
      selectedCard.flipped = true;
      this.counter++;
    }

    if (this.counter === 2) {
      this.isProcessing = true;
      this.checkCards();
    }
  }

  checkCards() {
    if (this.twoCard.length !== 2) return;
    if (
      this.twoCard[0].name === this.twoCard[1].name &&
      this.twoCard[0].id !== this.twoCard[1].id
    ) {
      this.setCardToMatched(this.twoCard[0], this.twoCard[1]);
    } else {
      this.flipCardsBack();
    }
    this.currentResult++;
    this.localStorageStore(this.cardList);
  }

  hideTheCard() {
    if (this.twoCard.length === 2 && !this.twoCard[0].matched && !this.twoCard[1].matched) {
      this.twoCard[0].flipped = false;
      this.twoCard[1].flipped = false;
    }
    this.counter = 0;
    this.twoCard = [];
  }

  checkGameStatus() {
    const unmatchedCard = this.cardList.find((card) => !card.matched);
    if (!unmatchedCard) {
      this.IsItStarted = false;
      this.ThereIsEndedGame = true;
      this.checkTheBestResult(this.currentResult);
      this.currentResult = 0;
      this.notification.showSuccess('You have won! Click the restart button, if you would like to play another game.', 'Matching Game v.1.0.0');
    }
  }

  checkTheBestResult(currentResult: number): number {
    if (currentResult > 0 && currentResult < this.bestResults[this.deckSize]) {
      this.bestResults[this.deckSize] = currentResult;
      this.saveBestResults();  // Mentés localStorage-be
    }
    return this.bestResults[this.deckSize];
  }

  localStorageStore(cardList: Card[]) {
    localStorage.setItem('cards', JSON.stringify(cardList));
  }

  localStorageRestore() {
    const storedCards = localStorage.getItem("cards");
    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards);
        if (Array.isArray(parsedCards) && parsedCards.length === this.deckSize) {
          this.cardList = parsedCards;
        } else {
          this.localStorageClear();
          this.shuffleCards(this.deckSize);
        }
      } catch (error) {
        this.localStorageClear();
        this.shuffleCards(this.deckSize);
      }
    } else {
      this.shuffleCards(this.deckSize);
    }
  }

  localStorageClear() {
    localStorage.removeItem("cards");
  }
}