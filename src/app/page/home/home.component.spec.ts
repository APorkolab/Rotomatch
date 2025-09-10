import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameStateService } from 'src/app/service/game-state.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let gameStateService: jasmine.SpyObj<GameStateService>;

  beforeEach(async () => {
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['selectDeckSize', 'convertStringToNumber']);

    await TestBed.configureTestingModule({
      imports: [ HomeComponent ],
      providers: [
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

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

  it('should call selectDeckSize on the service when Select is called', () => {
    const value = '12';
    component.Select(value);
    void expect(gameStateService.convertStringToNumber).toHaveBeenCalledWith(value);
    // We can't easily test the result of the above call without more complex mocking,
    // but we can check that selectDeckSize was called.
    void expect(gameStateService.selectDeckSize).toHaveBeenCalled();
  });
});
