import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit, OnDestroy {
  public deckSize = 0;
  private readonly subscriptions = new Subscription();
  public modalRef?: BsModalRef;

  public cardList$: Observable<Card[]>;
  public score$: Observable<number>;
  public isProcessing$: Observable<boolean>;
  public bestResults: { [key: number]: number } = {};

  public constructor(
    private readonly data: GameStateService,
    public gameLogic: GameLogicService,
    private readonly modalService: BsModalService
  ) {
    this.cardList$ = this.gameLogic.cardList$;
    this.score$ = this.gameLogic.score$;
    this.isProcessing$ = this.gameLogic.isProcessing$;
  }

  public ngOnInit(): void {
    const deckSizeSub = this.data.currentSelectedDeckSize.subscribe(deckSize => {
      if (deckSize > 0) {
        this.deckSize = deckSize;
        void this.restartGame();
      }
    });
    this.subscriptions.add(deckSizeSub);

    const newGameSub = this.data.currentNewGameWanted.subscribe(isANewGameWanted => {
      if (isANewGameWanted) {
        void this.restartGame();
      }
    });
    this.subscriptions.add(newGameSub);

    const gameWonSub = this.gameLogic.gameWon$.subscribe(() => {
      this.loadBestScore();
    });
    this.subscriptions.add(gameWonSub);

    this.loadBestScore();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public openModal(template: TemplateRef<object>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  private loadBestScore(): void {
    this.bestResults = this.gameLogic.loadBestResults();
  }

  public getBestScoreForCurrentDeck(): number {
    return this.bestResults[this.deckSize] || 0;
  }

  public restartGame(): void {
    this.modalRef?.hide();
    if (this.deckSize > 0) {
      void this.gameLogic.newGame(this.deckSize);
      this.loadBestScore();
    }
  }

  public revealCard(card: Card): void {
    this.gameLogic.revealCard(card);
  }

  public trackByCardId(index: number, card: Card): number | string {
    return card.id;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
