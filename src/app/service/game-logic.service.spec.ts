import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameLogicService } from './game-logic.service';
import { GameStateService } from './game-state.service';
import { NotificationService } from './notification.service';
import { Card } from '../model/card';

describe('GameLogicService', () => {
  let service: GameLogicService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let gameStateService: jasmine.SpyObj<GameStateService>;

  const mockCards: Card[] = [
    new Card({ id: 1, name: 'A', icon: '', flipped: false, matched: false }),
    new Card({ id: 2, name: 'B', icon: '', flipped: false, matched: false })
  ];

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['changeNewGameWanted']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        GameLogicService,
        { provide: NotificationService, useValue: notificationSpy },
        { provide: GameStateService, useValue: gameStateSpy }
      ]
    });

    service = TestBed.inject(GameLogicService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    gameStateService = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;

    // Mock the initial card load
    const req = httpMock.expectOne('assets/data/cards.json');
    req.flush(mockCards);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('should start a new game with a valid deck size', () => {
    void spyOn(service, 'newGame').and.callThrough();
    void service.newGame(2);
    void service.cardList$.subscribe(cards => {
      void expect(cards.length).toBe(2);
      void expect(cards[0].name).toBe('A');
    });
    expect(gameStateService.changeNewGameWanted).toHaveBeenCalledWith(false);
  });

  it('should show an error for an invalid deck size', () => {
    void service.newGame(3); // Odd number
    void expect(notificationService.showError).toHaveBeenCalled();
  });

  it('should reveal a card and flip it', () => {
    void service.newGame(2);
    let firstCard: Card;
    void service.cardList$.subscribe(cards => (firstCard = cards[0]));

    void service.revealCard(firstCard!);

    void service.cardList$.subscribe(cards => {
      void expect(cards[0].flipped).toBeTrue();
    });
  });

  it('should find a match when two identical cards are revealed', done => {
    void service.newGame(2); // This will create cards with name 'A' and 'A'

    let card1: Card, card2: Card;
    void service.cardList$
      .subscribe(cards => {
        [card1, card2] = cards;
      })
      .unsubscribe();

    void service.revealCard(card1!);
    void service.revealCard(card2!);

    void service.cardList$.subscribe(cards => {
      if (cards.length > 0 && cards.every((c: Card) => c.matched === true) === true) {
        void expect(cards.every((c: Card) => c.matched === true)).toBeTrue();
        done();
      }
    });
  });

  it('should flip cards back when they do not match', done => {
    // To test non-match, we need to load different cards
    const differentCards: Card[] = [
      new Card({ id: 1, name: 'A', icon: '', flipped: false, matched: false }),
      new Card({ id: 2, name: 'B', icon: '', flipped: false, matched: false }),
      new Card({ id: 3, name: 'C', icon: '', flipped: false, matched: false }),
      new Card({ id: 4, name: 'D', icon: '', flipped: false, matched: false })
    ];
    const req = httpMock.expectOne('assets/data/cards.json');
    req.flush(differentCards);

    void service.newGame(4);

    let card1: Card, card2: Card;
    void service.cardList$
      .subscribe(cards => {
        [card1, card2] = cards;
      })
      .unsubscribe();

    void service.revealCard(card1!);
    void service.revealCard(card2!); // Reveal two different cards

    // isProcessing becomes true, then false after timeout
    void service.isProcessing$.subscribe(isProcessing => {
      if (isProcessing === false && notificationService.showSuccess.calls.count() === 0) {
        // wait for flip back animation
        void service.cardList$.subscribe(cards => {
          void expect(cards.every((c: Card) => c.flipped === false)).toBeTrue();
          done();
        });
      }
    });
  });
});
