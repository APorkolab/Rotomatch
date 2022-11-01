import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService } from 'src/app/service/card.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  maxDeckSize = 20;
  // selectedDeckSize = 0;

  constructor(private router: Router, private data: CardService) { }

  ngOnInit(): void {
  }

  onSelected(value: number,): void {
    // this.selectedDeckSize = value;
    this.data.changeSelectedDeckSize(value);
    this.data.changeNewGameWanted(true);
  }

  ConvertStringToNumber(input: string) {
    let numeric = Number(input);
    return numeric;
  }
}
