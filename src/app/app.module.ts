import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
//import { GoogleChart } from '@ngular2-google-chart/directives/angular2-google-chart.directive';
import { GoogleChartsModule} from 'angular-google-charts'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SessionComponent } from './users/session/session.component';
import { StatsComponent } from './users/stats/stats.component';
import { AppRoutingModule } from './app-routing.module';
import { TableComponent } from './users/tabel/table.component';
import { UserdataComponent } from './users/userdata/userdata.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TryComponent } from './try/try.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SessionComponent,
    StatsComponent,
    TableComponent,
    UserdataComponent,
    HomepageComponent,
    TryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    HttpClientModule,
    MatExpansionModule,
    BrowserModule,
    MatTableModule,
    CommonModule,
    GoogleChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
