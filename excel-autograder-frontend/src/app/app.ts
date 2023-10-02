import { Component } from '@angular/core';
import { AuthService } from "./api/auth-service/auth.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  constructor(public authService: AuthService) { }
}
