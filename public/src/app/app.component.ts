import { Component } from '@angular/core';
import { UserService } from './models/user/user.service';
import { ThemeService } from './core/services';
import { ThemePreference } from './models/user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public userService: UserService,
    public themeService: ThemeService,
  ) { }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setThemePreference(pref: ThemePreference): void {
    this.themeService.setPreference(pref);
  }

  getUserInitial(): string {
    const username = this.userService.getUser()?.username;
    return username ? username.charAt(0).toUpperCase() : '?';
  }
}
