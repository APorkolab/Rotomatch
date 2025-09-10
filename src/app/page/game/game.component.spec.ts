import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameStateService } from 'src/app/service/game-state.service';
import { GameLogicService } from 'src/app/service/game-logic.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of, Subject } from 'rxjs';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameLogicService: jasmine.SpyObj<GameLogicService>;
  let modalService: jasmine.SpyObj<BsModalService>;

  beforeEach(async () => {
    const gameLogicSpy = jasmine.createSpyObj('GameLogicService', ['newGame', 'revealCard', 'loadBestResults'], {
      // Expose observables for the component to subscribe to
      cardList$: of([]),
      score$: of(0),
      isProcessing$: of(false),
      gameWon$: new Subject<void>().asObservable()
    });

    const gameStateSpy = jasmine.createSpyObj('GameStateService', [], {
      currentSelectedDeckSize: of(12), // Provide a default deck size
      currentNewGameWanted: of(false)
    });

    const modalSpy = jasmine.createSpyObj('BsModalService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ GameComponent ],
      providers: [
        { provide: GameLogicService, useValue: gameLogicSpy },
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: BsModalService, useValue: modalSpy }
      ]
    })
      .compileComponents();

    gameLogicService = TestBed.inject(GameLogicService) as jasmine.SpyObj<GameLogicService>;
    modalService = TestBed.inject(BsModalService) as jasmine.SpyObj<BsModalService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should start a new game on init', () => {
    void expect(gameLogicService.newGame).toHaveBeenCalledWith(12);
  });

  it('should call revealCard on the service when a card is clicked', () => {
    const testCard = { id: 1, name: 'A', icon: '', flipped: false, matched: false };
    component.revealCard(testCard);
    void expect(gameLogicService.revealCard).toHaveBeenCalledWith(testCard);
  });

  it('should call openModal on the modal service', () => {
    const template: any = 'mockTemplate';
    component.openModal(template);
    void expect(modalService.show).toHaveBeenCalledWith(template, { class: 'modal-sm' });
  });

  it('should call newGame when restartGame is called', () => {
    component.deckSize = 12; // ensure deckSize is set
    component.restartGame();
    // It should have been called once on init, and once on restart
    void expect(gameLogicService.newGame.calls.count()).toBe(2);
    void expect(gameLogicService.newGame).toHaveBeenCalledWith(12);
  });
});
