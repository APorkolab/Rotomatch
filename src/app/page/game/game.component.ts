import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from 'src/app/model/card';
import { Subscription, Observable } from 'rxjs';
import { GameStateService } from 'src/app/service/game-state.service';
import { GameLogicService } from 'src/app/service/game-logic.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class GameComponent implements OnInit, OnDestroy {
  deckSize = 0;
  private subscriptions = new Subscription();
  modalRef?: BsModalRef;

  cardList$: Observable<Card[]>;
  score$: Observable<number>;
  isProcessing$: Observable<boolean>;
  bestResults: { [key: number]: number } = {};

  constructor(
    private data: GameStateService,
    public gameLogic: GameLogicService,
    private modalService: BsModalService
  ) {
    this.cardList$ = this.gameLogic.cardList$;
    this.score$ = this.gameLogic.score$;
    this.isProcessing$ = this.gameLogic.isProcessing$;
  }

  ngOnInit(): void {
    const deckSizeSub = this.data.currentSelectedDeckSize.subscribe(deckSize => {
      if (deckSize > 0) {
        this.deckSize = deckSize;
        this.restartGame();
      }
    });
    this.subscriptions.add(deckSizeSub);

    const newGameSub = this.data.currentNewGameWanted.subscribe(isANewGameWanted => {
      if (isANewGameWanted) {
        this.restartGame();
      }
    });
    this.subscriptions.add(newGameSub);

    const gameWonSub = this.gameLogic.gameWon$.subscribe(() => {
      this.loadBestScore();
    });
    this.subscriptions.add(gameWonSub);

    this.loadBestScore();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  private loadBestScore(): void {
    this.bestResults = this.gameLogic.loadBestResults();
  }

  getBestScoreForCurrentDeck(): number {
    return this.bestResults[this.deckSize] || 0;
  }

  restartGame(): void {
    this.modalRef?.hide();
    if (this.deckSize > 0) {
      this.gameLogic.newGame(this.deckSize);
      this.loadBestScore();
    }
  }

  revealCard(card: Card): void {
    this.gameLogic.revealCard(card);
  }

  trackByCardId(index: number, card: Card): number | string {
    return card.id;
  }
}