import { Component } from "@angular/core";
import { UsersService } from "src/app/users/users.service";
import { User } from "../user-model";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})

export class SessionComponent {
  enteredUsername = "";
  loggedin = false;
  loggedinError = false;
  loggedout = false;
  loggedoutError = false;
  loggedoutError2 = false;  // daca utilizatorul nu exista, nici nu poate fi delogat
  deleted = false;
  deletedError = false;
  deletedall = false;

  constructor(public userService: UsersService) {}

  async onLogin() {
    if(this.enteredUsername.length === 0) {
      return;
    }
    let alreadyLogged = await this.userService.checkLogin(this.enteredUsername);

    if(alreadyLogged)
    {
      this.enteredUsername = "";
      this.loggedinError = true;
      setTimeout(() => {
        this.loggedinError = false;
      }, 2700);
      return;
    }

    await this.userService.loginUser(this.enteredUsername);
    this.enteredUsername = "";
    this.loggedin = true;
    setTimeout(() => {
      this.loggedin = false;
    }, 2700);
  }

  async onLogout() {
    if(this.enteredUsername.length === 0) {
      return;
    }

    let exista = await this.userService.checkIfUserExists(this.enteredUsername);
    if(!exista) {
      this.enteredUsername = "";
      this.loggedoutError2 = true;
      setTimeout(() => {
        this.loggedoutError2 = false;
      }, 2700);
      return;
    }

    let alreadyLogged = await this.userService.checkLogin(this.enteredUsername);

    if(!alreadyLogged) {
      this.enteredUsername = "";
      this.loggedoutError = true;
      setTimeout(() => {
        this.loggedoutError = false;
      }, 2700);
      return;
    }

    await this.userService.logoutUser(this.enteredUsername);
    this.enteredUsername = "";
    this.loggedout = true;
    setTimeout(() => {
      this.loggedout = false;
    }, 2700);
  }

  async onDelete() {
    if(this.enteredUsername.length === 0) {
      return;
    }
    let userExists = await this.userService.checkIfUserExists(this.enteredUsername);
    if(!userExists) {
      this.deletedError = true;
      setTimeout(() => {
        this.deletedError = false;
      }, 2700);
      return;
    }
    await this.userService.deleteUser(this.enteredUsername);
    this.enteredUsername = "";
    this.deleted = true;
    setTimeout(() => {
      this.deleted = false;
    }, 2700);
  }

  async onDeleteAll() {
    await this.userService.deleteAll();
    this.deletedall = true;
    setTimeout(() => {
      this.deletedall = false;
    }, 2700);
  }
}
