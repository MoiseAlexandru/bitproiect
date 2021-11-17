import { Component, OnInit } from "@angular/core";
import { User } from "../user-model";
import { UsersService } from "../users.service";
import { finUser } from "../userfinished-model";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit{
  constructor(public usersService: UsersService) {}

  userList = [];
  users: finUser[] = [];
  sortedUsersByTimeSpent: finUser[] = [];
  sortedUsersByLogins: finUser[] = [];
  chartData;
  secondChartData;
  async ngOnInit() {
    this.userList = await this.usersService.getUserList();
    for(let i = 0; i < this.userList.length; i++) {
      this.users.push(await this.usersService.getUserInfo(this.userList[i]));
    }
    this.sortedUsersByTimeSpent = this.users;
    this.sortedUsersByLogins = this.users;
    this.sortedUsersByTimeSpent.sort(function(a: finUser, b: finUser) {
      return b.timeSpentNumber - a.timeSpentNumber;
    });
    this.sortedUsersByLogins.sort(function(a: finUser, b: finUser) {
      return b.loginsNumber - a.loginsNumber;
    });
    /// acum iau primii 5 useri + restul
    let auxData = [];
    for(let i = 0; i < Math.min(this.sortedUsersByTimeSpent.length, 5); i++)
      auxData.push([this.sortedUsersByTimeSpent[i].username, this.sortedUsersByTimeSpent[i].timeSpentNumber]);
    let sum = 0;
    for(let i = 6; i < this.sortedUsersByTimeSpent.length; i++)
      sum = sum + this.sortedUsersByTimeSpent[i].timeSpentNumber;
    auxData.push(["Other", sum]);

    this.chartData = {
      title: "Total time online by users",
      type: 'PieChart',
      data: auxData,
      width: 1000,
      height: 400
    };

    auxData = [];
    for(let i = 0; i < this.users.length; i++)
      auxData.push([this.users[i].username, this.users[i].loginsNumber]);
    sum = 0;
    for(let i = 6; i < this.sortedUsersByLogins.length; i++)
      sum = sum + this.sortedUsersByLogins[i].loginsNumber
    //auxData.push(["Other", sum]);
    this.secondChartData = {
      title: "Logins by users",
      type: 'BarChart',
      data: auxData,
      width: 1000,
      height: 400,
    };
  }
}
