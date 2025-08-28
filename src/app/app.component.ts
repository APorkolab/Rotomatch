import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CollapseModule]
})
export class AppComponent {
  isCollapsed = true;
}
