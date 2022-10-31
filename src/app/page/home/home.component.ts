import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  maxDeckSize = 20;
  selectedDeckSize = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSelected(value: number): void {
    this.selectedDeckSize = value;

  }

  ConvertStringToNumber(input: string) {
    let numeric = Number(input);
    return numeric;
  }
}
