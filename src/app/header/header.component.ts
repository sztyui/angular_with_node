import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated: boolean = false;
  public authenticatedUserName: string = "";
  private authListenerSubs: Subscription;
  private authNameSubs: Subscription;

  constructor(private authService: AuthService){}

  public ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authenticatedUserName = this.authService.getAuthName();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.authNameSubs = this.authService
      .getAuthNameListener()
      .subscribe((authName) => {
        this.authenticatedUserName = authName;
      });
  }

  public onLogout() {
    this.authService.logout();
  }

  public ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
    this.authNameSubs.unsubscribe();
  }
}
