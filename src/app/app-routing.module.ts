import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "./homepage/homepage.component";
import { TryComponent } from "./try/try.component";
import { SessionComponent } from "./users/session/session.component";
import { StatsComponent } from "./users/stats/stats.component";
import { TableComponent } from "./users/tabel/table.component";
import { UserdataComponent } from "./users/userdata/userdata.component";

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'session', component: SessionComponent},
  {path: 'stats', component: StatsComponent},
  {path: 'table', component: TableComponent},
  {path: 'user/:username', component: UserdataComponent},
  {path: 'try', component: TryComponent}
];

@NgModule ({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
