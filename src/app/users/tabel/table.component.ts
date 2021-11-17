import { Component } from "@angular/core";
import { UsersService } from "../users.service";
import { User } from "../user-model";
import { finUser } from "../userfinished-model";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent {
  constructor(public usersService: UsersService) {}

  userList = [];
  users: finUser[] = [];
  
  async ngOnInit() {
    this.userList = await this.usersService.getUserList();
    for(let i = 0; i < this.userList.length; i++) {
      let info = await this.usersService.getUserInfo(this.userList[i])
      this.users.push(info);
    }

  }
}
