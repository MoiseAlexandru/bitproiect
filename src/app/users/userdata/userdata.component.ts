import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../user-model";
import { UsersService } from "../users.service";
import { finUser } from "../userfinished-model";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.css']
})

export class UserdataComponent {
  constructor(public usersService: UsersService, public activatedRoute: ActivatedRoute) {}
  data: finUser;
  username: string;
  firstLogin: string;
  lastLogin: string;
  logins;
  chartData;
  async ngOnInit() {
    this.username = this.activatedRoute.snapshot.params['username'];

    this.data = await this.usersService.getUserInfo(this.username);

    this.logins = await this.usersService.getUserLogins(this.username);

    let auxData = [];
    auxData.push(["0", 0]);
    for(let i = 0; i < this.logins.length; i++)
      auxData.push([(i + 1).toString(), this.logins[i].timeSpent / 1000]);

    this.chartData = {

      type: 'LineChart',
      data: auxData,
      options: {
        hAxis: {
          title: "Session number",
        },
        vAxis: {
          title: "Session duration (s)"
        },
      },
      width: 1000,
      height: 400
    };

  }

}
