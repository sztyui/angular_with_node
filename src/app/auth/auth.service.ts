import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.module'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  public getToken() {
    return this.token;
  }

  public getIsAuth() {
    return this.isAuthenticated;
  }

  public getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

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

  public login(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token){
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
 }

 public logout() {
   this.token = null;
   this.isAuthenticated = false;
   this.authStatusListener.next(false);
   clearTimeout(this.tokenTimer);
   this.router.navigate(['/']);
 }

 private saveAuthData (token: string, expirationDate: Date) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
 }
}
