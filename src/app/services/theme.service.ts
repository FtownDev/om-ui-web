import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = false;
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const storedTheme = sessionStorage.getItem('themePreference');
    if (storedTheme) {
      this.isDarkMode = storedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }

    this.darkMode.next(this.isDarkMode);
    this.updateTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.darkMode.next(this.isDarkMode);
    this.updateTheme();
  }

  private updateTheme() {
    sessionStorage.setItem(
      'themePreference',
      this.isDarkMode ? 'dark' : 'light'
    );

    const classList = document.documentElement.classList;
    if (this.isDarkMode) {
      classList.add('dark');
    } else {
      classList.remove('dark');
    }
  }
}
