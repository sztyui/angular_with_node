import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.module'

@Injectable({
  providedIn: "root"
})
export class AuthService {

  constructor(private http: HttpClient) {}

  public createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(resp => {
        console.log(resp);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        
      })
  }
}