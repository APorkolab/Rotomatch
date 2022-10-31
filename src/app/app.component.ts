import { Component } from '@angular/core';
import { elementAt } from 'rxjs';
import { GameComponent } from './page/game/game.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MatchingGameAngular';

  constructor() {

  }


  //possible update to get maxDeckSize from Game component
}
