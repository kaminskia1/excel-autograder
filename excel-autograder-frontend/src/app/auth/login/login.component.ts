import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../api/auth-service/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {UserCredentials} from "../../api/auth-service/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInForm

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(formData: any): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {
      this.authService.login(formData.username, formData.password);
    }
  }
}
