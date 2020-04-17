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
          this.setAuthTimer(expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const expirationDate = new Date((new Date()).getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate)
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
    this.setAuthTimer(expiresIn)
    this.authStatusListener.next(true);
  }
 }

 public logout() {
   this.token = null;
   this.isAuthenticated = false;
   this.authStatusListener.next(false);
   clearTimeout(this.tokenTimer);
   this.clearAuthData();
   this.router.navigate(['/']);
 }

 private setAuthTimer(duration: number) {
  this.tokenTimer = setTimeout(() => {
    this.logout();
  }, duration);
 }

 private saveAuthData (token: string, expirationDate: Date) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
 }

 private clearAuthData (){
   localStorage.removeItem("token");
   localStorage.removeItem("expiration");
 }

 private getAuthData() {
   const token = localStorage.getItem("token");
   const expirationDate = localStorage.getItem("expirationDate");
   if (!token || !expirationDate){
    return;
   }
   return {
     token: token,
     expirationDate: new Date(expirationDate)
   }
 }
}
