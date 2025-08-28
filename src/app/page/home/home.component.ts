import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GameStateService } from 'src/app/service/game-state.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class HomeComponent implements OnInit {
  maxDeckSize = 20;
  // selectedDeckSize = 0;

  constructor(private router: Router, private data: GameStateService) { }

  ngOnInit(): void {
  }

  Select(value: string) {
    this.data.selectDeckSize(this.data.convertStringToNumber(value))
  }

}
