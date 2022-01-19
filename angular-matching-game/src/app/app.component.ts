import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';

import { ListOfAllCard } from './common/card-list/list-of-all-card';
import { CardComponent } from './common/card/card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChildren(CardComponent) cardComponents!: QueryList<CardComponent>;

  title = 'Splendex Memory Game';
  cardList!: any[];
  IsItStarted = false;
  firstCard: any;
  secondCard: any;
  ThereIsEndedGame = false;
  bestResult: number = 0;
  currentResult: number = 0;

  //Betöltéskor keverünk
  ngOnInit(): void {
    this.shuffleCards();
  }

  //Betöltjük a kártyák listáját, majd randomizált sorrendben rakjuk vissza a pakliban.
  shuffleCards() {
    const cards = JSON.parse(JSON.stringify(ListOfAllCard));
    let currentIndex = cards.length, //ha több időm lenne, át tudnám vezetni a "deck size" HTML-es select elem értékét és azt adnám meg a tömb mértékének, Itt vizsgálni kellene, hogy a tömb páros-e. (nehogy kijátszhatatlan legyen a játék)
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex],
      ];
    }
    this.cardList = cards;
  }

  //Játékkezedet kártyakeveréssel
  startGame() {
    if (this.ThereIsEndedGame) {
      this.shuffleCards();
    }
    this.IsItStarted = true;
  }

  //A játék újraindításakor nincs szükség annak vizsgálatára, hogy játszottunk-e már? Lehetséges továbbfejlesztés: megerősítő felugró ablak.
  restartGame() {
    this.shuffleCards();
  }

  //A kártya kiválasztása. Vizsgáljuk a kártya azonosságát.
  onCardSelect(selectedCard: any) {
    this.cardList.forEach((card) => {
      if (card.id === selectedCard.id) {
        card.flipped = true;
      }
    });
    if (!this.firstCard) {
      this.firstCard = selectedCard;
    } else if (this.firstCard && !this.secondCard) {
      this.secondCard = selectedCard;
    }
    if (this.firstCard && this.secondCard) {
      this.checkCards();
    }
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
  checkCards() {
    if (
      this.firstCard.name === this.secondCard.name &&
      this.firstCard.id !== this.secondCard.id
    ) {
      this.setCardToMatched(this.firstCard, this.secondCard);
      this.currentResult = this.currentResult + 1;
    } else {
      this.flipCardsBack();
      this.currentResult = this.currentResult + 1;
    }
    this.firstCard = null;
    this.secondCard = null;
  }

  //A megtalált kártyák szettere.
  setCardToMatched(card1: any, card2: any) {
    this.cardList.forEach((card) => {
      if (card.id === card1.id || card.id === card2.id) {
        card.flipped = true;
        card.matched = true;
      }
    });
    this.checkGameStatus();
  }

  //A nem párban levő kártyák visszafordulásáért felelős függvény.
  flipCardsBack() {
    for (let cardComponent of this.cardComponents) {
      setTimeout(() => {
        cardComponent.hideTheCard();
      }, 500);
    }
  }

  //A játék kijátszását ellenőrzi.
  checkGameStatus() {
    const unmatchedCard = this.cardList.find((card) => !card.matched);
    if (!unmatchedCard) {
      this.IsItStarted = false;
      this.ThereIsEndedGame = true;
      this.checktheBestResult(this.currentResult);
    }
  }
}
