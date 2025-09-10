import { TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()]
    });
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
