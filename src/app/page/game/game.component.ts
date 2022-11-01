import { NotificationService } from './../../service/notification.service';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren, OnChanges } from '@angular/core';
import { Card } from 'src/app/model/card';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/service/card.service';
import { Router, RouterModule, Routes } from '@angular/router';

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

  bestResult = 0;
  currentResult = 0;
  counter = 0;


  listOfAllCard: Card[] = [
    {
      id: 1,
      name: 'Angular',
      icon: '../../../assets/images/cards/angular.png',
      flipped: false,
      matched: false,
    },
    {
      id: 2,
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
      id: 4,
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
      id: 6,
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
      id: 8,
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
      id: 10,
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
      id: 12,
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
      id: 14,
      name: 'SASS',
      icon: '../../../assets/images/cards/sass.png',
      flipped: false,
      matched: false,
    },
    {
      id: 15,
      name: 'Splendex',
      icon: '../../../assets/images/cards/splendex.png',
      flipped: false,
      matched: false,
    },
    {
      id: 16,
      name: 'Splendex',
      icon: '../../../assets/images/cards/splendex.png',
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
      id: 18,
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
    {
      id: 20,
      name: 'Webpack',
      icon: '../../../assets/images/cards/webpack.png',
      flipped: false,
      matched: false,
    },
  ];

  constructor(private notification: NotificationService, private data: CardService, private router: Router) {
  }


  ngOnInit(): void {
    this.deckSizeSubscription = this.data.currentselectedDeckSize.subscribe(deckSize => this.deckSize = deckSize)
    this.newGameWantedSubscription = this.data.currentNewGameWanted.subscribe(isANewGameWanted => this.newGameWanted = isANewGameWanted)
    this.bestResult = Number(localStorage.getItem('bestResult'));
    this.startGame();
    if (!this.deckSize) {
      this.notification.showError('There is no data of decksize. Please, reset the application or wait 2 seconds.', 'Matching Game v.1.0.0');
      setTimeout(() => {
        this.router.navigate(['/'])
      }, 2000);
    };
    // console.log("Size of the deck:" + this.deckSize);
  }

  //Játékkezedet kártyakeveréssel vagy a parti visszaállításával
  startGame() {
    if (this.ThereIsEndedGame || this.newGameWanted) {
      this.shuffleCards(this.deckSize);
      this.localStorageClear();
    } else {
      this.localStorageRestore();
    }
    this.IsItStarted = true;
  }

  //A játék újraindításakor nincs szükség annak vizsgálatára, hogy játszottunk-e már?
  restartGame() {
    this.data.changeNewGameWanted(true);
    this.data.changeSelectedDeckSize(this.deckSize);
    this.startGame();
    this.localStorageClear();
    this.ThereIsEndedGame = false;
    this.currentResult = 0;
  }

  //Betöltjük a kártyák listáját, majd randomizált sorrendben rakjuk vissza a pakliba.
  shuffleCards(deckSize: number) {
    let cards: Card[] = this.listOfAllCard;
    let randomIndex: number;
    if (deckSize % 2 == 0 && deckSize !== 0) {
      this.notification.showSuccess('The size (' + deckSize + ') of the deck is correct, because it is even. Therefore the decksize has been set.', 'Matching Game v.1.0.0');
    } else {
      deckSize = 20;
      this.notification.showError('The size of the deck is incorrect, because it is not even or null/undefined. The decksize will be 20.', 'Matching Game v.1.0.0')
    }
    cards.length = deckSize;
    while (deckSize != 0) {
      randomIndex = Math.floor(Math.random() * deckSize);
      deckSize--;
      [cards[deckSize], cards[randomIndex]] = [
        cards[randomIndex],
        cards[deckSize],
      ];
    }
    this.cardList = cards;
    this.data.changeNewGameWanted(false);
  }



  //A megtalált kártyák szettere.
  setCardToMatched(card1: Card, card2: Card) {
    this.twoCard.forEach((card) => {
      if (card.id === card1.id || card.id === card2.id) {
        card.flipped = true;
        card.matched = true;
        this.counter = 0;
      }
    });
    this.checkGameStatus();
    this.twoCard.splice(0, this.twoCard.length);
  }

  //A nem párban levő kártyák visszafordulásáért felelős függvény.
  flipCardsBack() {
    setTimeout(() => {
      this.hideTheCard();
    }, 1000);
  }


  revealTheCard(selectedCard: Card) {
    if (!selectedCard.flipped && this.counter >= 0 && this.counter <= 1) {
      this.twoCard.push(selectedCard);
      selectedCard.flipped = true;
      this.counter++;
    }

    if (this.counter === 2) {
      this.checkCards();
    }
  }

  checkCards() {
    if (
      this.twoCard[0].name === this.twoCard[1].name &&
      this.twoCard[0].id !== this.twoCard[1].id
    ) {
      this.setCardToMatched(this.twoCard[0], this.twoCard[1]);
      this.currentResult = this.currentResult + 1;
    } else {
      this.flipCardsBack();
      this.currentResult = this.currentResult + 1;
    }
    this.localStorageStore(this.cardList);
  }

  hideTheCard() {
    if (this.twoCard[0].flipped && !this.twoCard[0].matched && this.twoCard[1].flipped && !this.twoCard[1].matched) {
      this.twoCard[0].flipped = false;
      this.twoCard[1].flipped = false;
    }
    this.counter = 0;
    this.twoCard.splice(0, this.twoCard.length)
  }

  //A játék kijátszását ellenőrzi.
  checkGameStatus() {
    const unmatchedCard = this.cardList.find((card) => !card.matched);
    if (!unmatchedCard) {
      this.IsItStarted = false;
      this.ThereIsEndedGame = true;
      this.checktheBestResult(this.currentResult);
      this.currentResult = 0;
      this.notification.showSuccess('You have won! Click the restart button, if you would like to play an another game.', 'Matching Game v.1.0.0')
    }
  }

  //A legjobb kirakási eredmény vizsgálata.
  checktheBestResult(currentResult: number): number {
    if (currentResult != 0 && currentResult > this.bestResult) {
      this.bestResult = currentResult;
      localStorage.setItem('bestResult', JSON.stringify(this.bestResult));

    }
    this.currentResult = 0;
    return this.bestResult;
  }


  localStorageStore(cardList: Card[]) {
    this.localStorageClear();
    cardList.map(card => localStorage.setItem('cards', JSON.stringify(cardList)));
  }

  localStorageRestore() {
    this.cardList.splice(0, this.cardList.length);
    this.cardList = JSON.parse(localStorage.getItem("cards")!);
  }

  localStorageClear() {
    localStorage.removeItem("cards");
  }

}
