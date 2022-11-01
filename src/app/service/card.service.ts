import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private selectedDeckSize = new BehaviorSubject<number>(0);
  currentselectedDeckSize = this.selectedDeckSize.asObservable();


  private newGameWanted = new BehaviorSubject<boolean>(false);
  currentNewGameWanted = this.newGameWanted.asObservable();

  constructor(private message: NotificationService) { }

  changeSelectedDeckSize(value: number) {
    this.selectedDeckSize.next(value);
  }

  changeNewGameWanted(value: boolean) {
    this.newGameWanted.next(value);
  }


  onSelected(value: number,): void {
    // this.selectedDeckSize = value;
    this.changeSelectedDeckSize(value);
    this.changeNewGameWanted(true);
  }

  ConvertStringToNumber(input: string) {
    let numeric = Number(input);
    return numeric;
  }

}
