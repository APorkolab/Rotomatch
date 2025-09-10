import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly selectedDeckSize = new BehaviorSubject<number>(0);
  public currentSelectedDeckSize = this.selectedDeckSize.asObservable();

  private readonly newGameWanted = new BehaviorSubject<boolean>(false);
  public currentNewGameWanted = this.newGameWanted.asObservable();

  public constructor(private readonly message: NotificationService) {}

  public changeSelectedDeckSize(value: number): void {
    this.selectedDeckSize.next(value);
  }

  public changeNewGameWanted(value: boolean): void {
    this.newGameWanted.next(value);
  }

  public selectDeckSize(value: number): void {
    this.changeSelectedDeckSize(value);
    this.changeNewGameWanted(true);
  }

  public convertStringToNumber(input: string): number {
    const numeric = Number(input);
    if (isNaN(numeric)) {
      this.message.showError('Invalid number format', 'Error');
      return 0;
    }
    return numeric;
  }
}
