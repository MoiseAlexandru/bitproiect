import { Component } from "@angular/core";
import { finUser } from "../users/userfinished-model";
import { UsersService } from "../users/users.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {
  constructor(public usersService: UsersService) {}

  loggedinNumber = 0;

  async ngOnInit() {
    let userList = []
    userList = await this.usersService.getUserList();
    for(let i = 0; i < userList.length; i++) {
      let info = await this.usersService.getUserInfo(userList[i]);
      if(info.status === "online") {
        this.loggedinNumber++;
      }
    }
  }
}
