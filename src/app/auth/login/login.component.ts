import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  public isLoading = false;

  private authStatusSubs: Subscription;

  constructor(public authService: AuthService){}

  public ngOnInit () {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe((response) => {
      this.isLoading = false;
    });
  }

  onlogin (formData: NgForm) {
    if (formData.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(
      formData.value.email,
      formData.value.password
    )
  }

  public ngOnDestroy () {
    this.authStatusSubs.unsubscribe();
  }
}
