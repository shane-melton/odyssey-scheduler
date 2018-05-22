import { Component, OnInit } from '@angular/core';
import { IAdminCredentials } from '@shared/interfaces/Auth';
import { AuthService } from '@client/core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  credentials: IAdminCredentials = {
    username: '',
    password: ''
  };

  constructor(private readonly auth: AuthService, private readonly router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.auth.loginAdmin(this.credentials)
      .then(() => {
          return this.router.navigate(['admin/dash']);
      })
      .catch(() => {
        alert('Failed!');
      });
  }

}
