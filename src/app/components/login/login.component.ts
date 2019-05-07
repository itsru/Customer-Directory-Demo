import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { map, take, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authState: any;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('',
      Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
    });
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }

  login() {
    this.authService.login(this.loginForm.get('email').value.trim(), this.loginForm.get('password').value.trim())
    .then(res => {
      if (res)  {
        this.goToCustomers();
        this.toastr.success('Logged in succesfully');
      }
    }, err => {
      this.toastr.success(err.message);
    });
  }

  logout() {
    this.authService.logout().then( res => {
      this.toastr.success('Logged out');
    });
  }

    // use getters to avoid boiler markup for validators
    get email() {
      return this.loginForm.get('email');
    }

    get password() {
      return this.loginForm.get('password');
    }

}
