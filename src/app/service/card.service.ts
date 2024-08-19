import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private selectedDeckSize = new BehaviorSubject<number>(0);
  currentSelectedDeckSize = this.selectedDeckSize.asObservable();

  private newGameWanted = new BehaviorSubject<boolean>(false);
  currentNewGameWanted = this.newGameWanted.asObservable();

  constructor(private message: NotificationService) { }

  changeSelectedDeckSize(value: number) {
    this.selectedDeckSize.next(value);
  }

  changeNewGameWanted(value: boolean) {
    this.newGameWanted.next(value);
  }

  selectDeckSize(value: number): void {
    this.changeSelectedDeckSize(value);
    this.changeNewGameWanted(true);
  }

  convertStringToNumber(input: string): number {
    let numeric = Number(input);
    if (isNaN(numeric)) {
      this.message.showError('Invalid number format', 'Error');
      return 0;
    }
    return numeric;
  }

}
