import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesComponent {
  public constructor() {}

  // ngOnInit removed as it was empty
}
