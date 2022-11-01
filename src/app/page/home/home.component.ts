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

  Select(value: string) {
    this.data.onSelected(this.data.ConvertStringToNumber(value))
  }

}
