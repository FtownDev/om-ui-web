import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    imports: [
    NgIcon,
    NgClass
],
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
