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
  private authenticatedUserName: string = "";
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();
  private authNameListener = new Subject<string>();

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

  public getAuthNameListener(){
    return this.authNameListener.asObservable();
  }

  public getAuthName(){
    return this.authenticatedUserName;
  }

  public createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(resp => {
        this.router.navigate(['/', 'login']);
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
          this.setAuthTimer(expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.authenticatedUserName = email;
          this.authNameListener.next(email);
          const now = new Date();
          const expirationDate = new Date((new Date()).getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, email)
          this.router.navigate(['/']);
        }
      })
 }

 public autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) return;
  const expiresIn = authInformation.expirationDate.getTime() - (new Date()).getTime();
  if (expiresIn > 0) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.authenticatedUserName = authInformation.email;
    this.setAuthTimer(expiresIn)
    this.authStatusListener.next(true);
    this.authNameListener.next(this.authenticatedUserName);
  }
 }

 public logout() {
   this.token = null;
   this.isAuthenticated = false;
   this.authenticatedUserName = "";
   this.authStatusListener.next(false);
   this.authNameListener.next("");
   clearTimeout(this.tokenTimer);
   this.clearAuthData();
   this.router.navigate(['/']);
 }

 private setAuthTimer(duration: number) {
  this.tokenTimer = setTimeout(() => {
    this.logout();
  }, duration);
 }

 private saveAuthData (token: string, expirationDate: Date, email: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
  localStorage.setItem("email", email);
 }

 private clearAuthData (){
   localStorage.removeItem("token");
   localStorage.removeItem("expiration");
   localStorage.removeItem("email");
 }

 private getAuthData() {
   const token = localStorage.getItem("token");
   const expirationDate = localStorage.getItem("expiration");
   const email = localStorage.getItem("email");
   if (!token || !expirationDate){
    return;
   }
   return {
     token: token,
     expirationDate: new Date(expirationDate),
     email: email
   }
 }
}
