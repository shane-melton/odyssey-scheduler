import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@client/core/auth/auth.service';
import {StudentService} from '@client/core/student/student.service';
import * as moment from 'moment';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {
  studentNumber: string;
  birthday: string;
  errorMsg: string;
  submitted = false;

  constructor(private readonly authService: AuthService,
              private readonly studentService: StudentService,
              private readonly router: Router) {
  }

  ngOnInit() {
  }

  loginSubmit() {
    this.submitted = true;
    this.errorMsg = '';

    const birthdate = moment(this.birthday, 'MM/DD/YYYY').toDate();

    this.authService.loginStudent(this.studentNumber, birthdate)
      .then(() => {
        this.studentService.getCurrentStudent().subscribe();
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
