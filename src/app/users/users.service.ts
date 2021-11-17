
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { finUser } from "./userfinished-model";
import { User } from "./user-model";

@Injectable({providedIn: 'root'})

export class UsersService {

  constructor(private http: HttpClient) {}

  async getUserList() {
    let userList = [];
    let returnedList = [];
    await this.http
      .get <{users:any}> ('http://localhost:3000/api/users/getlist').toPromise()
      .then(results => {
        userList = results.users;
      })
    for(let i = 0; i < userList.length; i++)
      returnedList.push(userList[i]._source.username);
    let finalList = [];
    for(let i = 0; i < returnedList.length; i++) {
      let duplicate = false;
      for(let j = 0; j < finalList.length; j++) {
        if(returnedList[i] === finalList[j]) {
          duplicate = true;
          break;
        }
      }
      if(duplicate === false) {
        finalList.push(returnedList[i]);
      }
    }
    //console.log(userList);
    return finalList;
  }

  async checkLogin (username: string) {
    let result: boolean;
    await this.http
      .get <{message: string, found: boolean}> ('http://localhost:3000/api/users/findlogged/' + username).toPromise()
      .then(res => {
        result = res.found;
      })
    return result;
  }

  async loginUser(username: string) {
    let body = {username: username}
    await this.http
      .put('http://localhost:3000/api/users/create', body).toPromise()
      .then()
  }

  async logoutUser(username: string) {

    // Caut utilizatorul logat; imi trebuie id-ul
    let loginDate = 0;
    let id: string;
    await this.http
      .get <{id: any, loginStart: number}> ('http://localhost:3000/api/users/findlogged/' + username).toPromise()
      .then(res => {
        id = res.id,
        loginDate = res.loginStart
      });
    this.http.get('http://localhost:3000/api/users/logout/' + id)
      .subscribe()
  }

  async deleteUser(username: string) {

    let body = {username: username};
    this.http
      .post <{message: string}> ('http://localhost:3000/api/users/delete', body)
      .subscribe();
  }

  async checkIfUserExists(username: string) {
    let answer = false;
    await this.http
      .get <{data: any, found: boolean}> ('http://localhost:3000/api/users/search/' + username).toPromise()
      .then(res => {
        answer = res.found;
      });
    return answer;
  }

  async getUserInfo(username: string) {
    let body: User;
    body = {username: null, firstLogin: null, timeSpent: 0, lastLogin: null, loginsNumber: null, averageLoginTime: null, status: null};
    let userList = [];
    let finishedList = [];

    await this.http
      .get <{data: any, found: boolean}> ('http://localhost:3000/api/users/search/' + username).toPromise()
      .then(res => {
        userList = res.data;
      });
    for(let i = 0; i < userList.length; i++) {
      finishedList.push(userList[i]._source);
    }
    body.username = finishedList[0].username;
    let firstLogin = finishedList[0].loginStart;
    let lastLogin = finishedList[0].loginStart;
    let timeSpent = 0;
    let status = "offline";
    for(let i = 0; i < finishedList.length; i++) {
      firstLogin = Math.min(firstLogin, finishedList[i].loginStart);
      lastLogin = Math.max(lastLogin, finishedList[i].loginStart);
      if(finishedList[i].loginEnd)
        timeSpent = timeSpent + finishedList[i].loginEnd - finishedList[i].loginStart;
      if(finishedList[i].loginStatus === true) {
        status = "online";
      }
    }
    body.firstLogin = firstLogin;
    body.lastLogin = lastLogin;

    if(status === "online")
      timeSpent = timeSpent + Date.now() - lastLogin;

    body.timeSpent = timeSpent;
    body.loginsNumber = finishedList.length;
    body.averageLoginTime = timeSpent / finishedList.length;
    body.status = status;

    let returnedBody: finUser = {
      timeSpentNumber: body.timeSpent,
      firstLogin: new Date(body.firstLogin).toLocaleString(),
      lastLogin: new Date(body.lastLogin).toLocaleString(),
      loginsNumber: body.loginsNumber,
      averageLoginTime: Math.trunc(body.averageLoginTime / 1000 / 3600) + "h, " + Math.trunc(body.averageLoginTime / 1000 / 60) % 60  + "m, " + Math.trunc(body.averageLoginTime / 1000) % 60 + "s",
      username: body.username,
      timeSpent: Math.trunc(body.timeSpent / 1000 / 3600) + "h, " + Math.trunc(body.timeSpent / 1000 / 60) % 60  + "m, " + Math.trunc(body.timeSpent / 1000) % 60 + "s",
      status: body.status
    }

    return returnedBody;
  }

  async deleteAll() {
    this.http
      .get('http://localhost:3000/api/users/erase')
      .subscribe();
  }

  async getUserLogins(username) {
    let loginList = [];
    let finishedList = [];
    await this.http
      .get <{data: any, found: boolean}> ('http://localhost:3000/api/users/search/' + username).toPromise()
      .then(res => {
        loginList = res.data;
      })
    for(let i = 0; i < loginList.length; i++) {
      let aux = loginList[i]._source;
      if(aux.loginStatus) {
        aux.timeSpent = Date.now() - aux.loginStart;
      }
      else {
        aux.timeSpent = aux.loginEnd - aux.loginStart;
      }
      finishedList.push(aux);
    }
    return finishedList;
  }

}
