export class Card {
  [k: string]: any;
  id: number | string = '';
  name: string = '';
  icon: string = '';
  flipped: boolean = false;
  matched: boolean = false;
  backColor?: string;
}
