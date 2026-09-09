import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: []
    });
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
