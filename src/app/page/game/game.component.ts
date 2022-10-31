import { NotificationService } from './../../service/notification.service';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren, OnChanges } from '@angular/core';
import { Card } from 'src/app/model/card';
import { count } from 'console';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  // oneCard!: Card;
  // selectedCard = new EventEmitter<any>();

  isItAFlippedCard: boolean = false;
  @ViewChildren(Card) cardComponents!: QueryList<Card>;
  cardList: Card[] = [];
  twoCard: Card[] = [];
  IsItStarted = false;
  firstCard!: Card | null;
  secondCard!: Card | null;
  ThereIsEndedGame = false;
  bestResult: number = 0;
  currentResult: number = 0;
  deckSize: number = 20;
  counter: number = 0;
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
  cards: any;


  constructor(private notification: NotificationService) { }

  ngOnInit(): void {
    this.shuffleCards(20);
    console.log("FirstCard:" + this.firstCard);
    console.log('SecondCard:' + this.secondCard);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['cardDetails'] && changes['cardDetails'].currentValue) {
  //     this.oneCard = changes['cardDetails'].currentValue;
  //     this.isItAFlippedCard = this.oneCard.flipped;
  //   }
  // }

  //Betöltjük a kártyák listáját, majd randomizált sorrendben rakjuk vissza a pakliban.
  shuffleCards(deckSize: number) {
    let cards: Card[] = this.listOfAllCard;
    let currentIndex: number;
    let randomIndex: number;
    if (deckSize % 2 == 0) {
      currentIndex = deckSize;
      cards.slice(20 - (deckSize - 1));
      this.notification.showSuccess('The size (' + deckSize + ') of the deck is correct, because it is even. Therefore the decksize has been set.', 'Matching Game v.1.0.0');
    } else {
      currentIndex = 20;
      this.notification.showError('The size of the deck is incorrect, because it is not even. The decksize will be 20.', 'Matching Game v.1.0.0')
    }
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex],
      ];
    }
    this.cardList = cards;
    console.log(this.cardList);
  }

  //Játékkezedet kártyakeveréssel
  startGame() {
    if (this.ThereIsEndedGame) {
      this.shuffleCards(this.deckSize);
    }
    this.IsItStarted = true;
  }

  //A játék újraindításakor nincs szükség annak vizsgálatára, hogy játszottunk-e már? Lehetséges továbbfejlesztés: megerősítő felugró ablak.
  restartGame() {
    this.shuffleCards(this.deckSize);
    this.currentResult = 0;
  }

  //A kártya kiválasztása. Vizsgáljuk a kártya azonosságát.
  onCardSelect(selectedCard: Card) {
    // this.cardList.forEach((card) => {
    //   if (card.id === selectedCard.id) {
    //     card.flipped = true;
    //     // selectedCard.flipped = true;
    //   }
    // });

    // if (!this.firstCard) {
    //   this.firstCard = selectedCard;

    // } else if (this.firstCard && !this.secondCard) {
    //   this.secondCard = selectedCard;

    // }
    // if (this.firstCard && this.secondCard) {
    //   this.checkCards();
    // }

  }

  //A legjobb kirakási eredmény vizsgálata.
  checktheBestResult(currentResult: number): number {
    if (currentResult != 0 && currentResult > this.bestResult) {
      this.bestResult = currentResult;
    }
    this.currentResult = 0;
    return this.bestResult;
  }

  //Kártyacsekkelés. Ha azonos a kettő, már nem fordul vissza, ha nem, akkor automatikusan visszafordul.

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


  //A játék kijátszását ellenőrzi.
  checkGameStatus() {
    const unmatchedCard = this.cardList.find((card) => !card.matched);
    if (!unmatchedCard) {
      this.IsItStarted = false;
      this.ThereIsEndedGame = true;
      this.checktheBestResult(this.currentResult);
      this.currentResult = 0;
    }
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
  // this.counter = 0;

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

  }

  hideTheCard() {
    if (this.twoCard[0].flipped && !this.twoCard[0].matched && this.twoCard[1].flipped && !this.twoCard[1].matched) {
      this.twoCard[0].flipped = false;
      this.twoCard[1].flipped = false;
    }
    this.counter = 0;
    this.twoCard.splice(0, this.twoCard.length)
    // if (this.firstCard != null && this.secondCard != null) {
    //   selectedCard.flipped = false;
    // }
  }

}
