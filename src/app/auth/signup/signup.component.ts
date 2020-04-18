import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service'
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public invalid = false;

  private authStatusSubs: Subscription;

  constructor(public authService: AuthService) {}

  public ngOnInit(){
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe((response) => {
      this.isLoading = false;
    });
  }

  public onSignup (form: NgForm){
    if  ( form.invalid )
      return;
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  public ngOnDestroy () {
    this.authStatusSubs.unsubscribe();
  }
}
