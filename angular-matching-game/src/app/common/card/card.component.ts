import {Component, Input, OnChanges, SimpleChanges, EventEmitter, Output,} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges {
  @Input() details: any;

  @Output() selectedCard = new EventEmitter<any>();

  isItAFlippedCard: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cardDetails'] && changes['cardDetails'].currentValue) {
      this.details = changes['cardDetails'].currentValue;
      this.isItAFlippedCard = this.details.flipped;
    }
  }

  revealTheCard() {
    if (!this.isItAFlippedCard) {
      this.isItAFlippedCard = true;
      this.selectedCard.emit(this.details);
    }
  }

  hideTheCard() {
    if (this.isItAFlippedCard && !this.details.matched) {
      this.isItAFlippedCard = false;
    }
  }
}
