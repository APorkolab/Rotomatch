import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameStateService } from 'src/app/service/game-state.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let gameStateService: jasmine.SpyObj<GameStateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['selectDeckSize']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    gameStateService = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should call selectDeckSize on the service when selectDeckSize is called', () => {
    const value = 12;
    component.selectDeckSize(value);
    void expect(gameStateService.selectDeckSize).toHaveBeenCalledWith(value);
  });
});
