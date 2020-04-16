import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  isLoading = false;
  invalid = false;

  constructor(public authService: AuthService){}

  onlogin(formData: NgForm){
    if (formData.invalid){
      return;
    }
    this.authService.login(
      formData.value.email,
      formData.value.password
    )
  }
}
