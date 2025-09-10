import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GameStateService } from 'src/app/service/game-state.service';
import { NotificationService } from 'src/app/service/notification.service';
import { GameLogicService } from 'src/app/service/game-logic.service';
import { AchievementsService } from 'src/app/services/achievements.service';
import { GameStateManagerService } from 'src/app/services/game-state-manager.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['selectDeckSize']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showInfo',
      'showWarning',
      'showError',
      'showSuccess'
    ]);
    const gameLogicSpy = jasmine.createSpyObj('GameLogicService', ['newGame', 'loadSavedGame']);
    const achievementsSpy = jasmine.createSpyObj('AchievementsService', ['getDetailedStats', 'unlockedCount']);
    achievementsSpy.getDetailedStats.and.returnValue({});
    achievementsSpy.unlockedCount.and.returnValue(0);
    const gameStateManagerSpy = jasmine.createSpyObj('GameStateManagerService', ['loadGameState']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: GameLogicService, useValue: gameLogicSpy },
        { provide: AchievementsService, useValue: achievementsSpy },
        { provide: GameStateManagerService, useValue: gameStateManagerSpy }
      ]
    }).compileComponents();

    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should set selectedDeckSize and show notification when selectDeckSize is called', () => {
    const value = 12;
    component.selectDeckSize(value);

    void expect(component.selectedDeckSize).toBe(value);
    void expect(notificationService.showInfo).toHaveBeenCalledWith(
      jasmine.stringContaining(`${value} cards`),
      'Game Settings'
    );
  });
});
