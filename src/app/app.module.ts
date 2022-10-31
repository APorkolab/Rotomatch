import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RulesComponent } from './page/rules/rules.component';
import { GameComponent } from './page/game/game.component';
import { ContactComponent } from './page/contact/contact.component';
import { HomeComponent } from './page/home/home.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    RulesComponent,
    GameComponent,
    ContactComponent,
    HomeComponent,

  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    RouterModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      onActivateTick: true,
      closeButton: true,
      preventDuplicates: true,
      timeOut: 5000,
      extendedTimeOut: 3000,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
