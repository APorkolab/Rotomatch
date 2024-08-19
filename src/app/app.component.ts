import { Component } from '@angular/core';
import { elementAt } from 'rxjs';
import { GameComponent } from './page/game/game.component';
import { CardService } from './service/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MatchingGameAngular';

  constructor(private data: CardService) {

  }

  Select(value: string) {
    this.data.selectDeckSize(this.data.convertStringToNumber(value))
  }

}
