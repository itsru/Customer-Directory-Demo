import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'customer-directory-demo';
  constructor(private authService: AuthService, private router: Router) {

    // Stream not necessary as router guard is in place
    if (this.authService.isAuthenticated() === true) {
      this.router.navigate(['customers']);
    }
  }

}
