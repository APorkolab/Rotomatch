import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameLogicService } from './game-logic.service';
import { GameStateService } from './game-state.service';
import { NotificationService } from './notification.service';
import { Card } from '../model/card';
import { of } from 'rxjs';

describe('GameLogicService', () => {
  let service: GameLogicService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let gameStateService: jasmine.SpyObj<GameStateService>;

  const mockCards: Card[] = [
    { id: 1, name: 'A', icon: '', flipped: false, matched: false },
    { id: 2, name: 'B', icon: '', flipped: false, matched: false },
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
    expect(service).toBeTruthy();
  });

  it('should start a new game with a valid deck size', () => {
    spyOn(service, 'newGame').and.callThrough();
    service.newGame(2);
    service.cardList$.subscribe(cards => {
      expect(cards.length).toBe(2);
      expect(cards[0].name).toBe('A');
    });
    expect(gameStateService.changeNewGameWanted).toHaveBeenCalledWith(false);
  });

  it('should show an error for an invalid deck size', () => {
    service.newGame(3); // Odd number
    expect(notificationService.showError).toHaveBeenCalled();
  });

  it('should reveal a card and flip it', () => {
    service.newGame(2);
    let firstCard: Card;
    service.cardList$.subscribe(cards => firstCard = cards[0]);

    service.revealCard(firstCard!);

    service.cardList$.subscribe(cards => {
      expect(cards[0].flipped).toBeTrue();
    });
  });

  it('should find a match when two identical cards are revealed', (done) => {
    service.newGame(2); // This will create cards with name 'A' and 'A'

    let card1: Card, card2: Card;
    service.cardList$.subscribe(cards => {
        [card1, card2] = cards;
    }).unsubscribe();

    service.revealCard(card1!);
    service.revealCard(card2!);

    service.cardList$.subscribe(cards => {
        if(cards.length > 0 && cards.every(c => c.matched)) {
            expect(cards.every(c => c.matched)).toBeTrue();
            done();
        }
    });
  });

  it('should flip cards back when they do not match', (done) => {
    // To test non-match, we need to load different cards
    const differentCards: Card[] = [
        { id: 1, name: 'A', icon: '', flipped: false, matched: false },
        { id: 2, name: 'B', icon: '', flipped: false, matched: false },
        { id: 3, name: 'C', icon: '', flipped: false, matched: false },
        { id: 4, name: 'D', icon: '', flipped: false, matched: false },
    ];
    const req = httpMock.expectOne('assets/data/cards.json');
    req.flush(differentCards);

    service.newGame(4);

    let card1: Card, card2: Card;
    service.cardList$.subscribe(cards => {
        [card1, card2] = cards;
    }).unsubscribe();

    service.revealCard(card1!);
    service.revealCard(card2!); // Reveal two different cards

    // isProcessing becomes true, then false after timeout
    service.isProcessing$.subscribe(isProcessing => {
        if (!isProcessing && notificationService.showSuccess.calls.count() === 0) { // wait for flip back animation
            service.cardList$.subscribe(cards => {
                expect(cards.every(c => !c.flipped)).toBeTrue();
                done();
            });
        }
    });
  });

});
