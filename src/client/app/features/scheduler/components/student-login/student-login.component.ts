import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@client/core/auth/auth.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {
  studentNumber: string;
  errorMsg: string;
  submitted = false;

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
  }

  ngOnInit() {
  }

  loginSubmit() {
    this.submitted = true;
    this.errorMsg = '';

    this.authService.loginStudent(this.studentNumber)
      .then(() => {
        return this.router.navigate(['../missed']);
      })
      .catch((error) => {
        setTimeout(() => {
          this.submitted = false;
          this.errorMsg = error;
        }, 1500);
      });
  }

}
