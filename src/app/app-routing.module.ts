import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './page/contact/contact.component';
import { GameComponent } from './page/game/game.component';
import { HomeComponent } from './page/home/home.component';
import { RulesComponent } from './page/rules/rules.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
},
{
  path: 'rules',
  component: RulesComponent,
},
{
  path: 'contact',
  component: ContactComponent,
},
{
  path: 'game',
  component: GameComponent,
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
