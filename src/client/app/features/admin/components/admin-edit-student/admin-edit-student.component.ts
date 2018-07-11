import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IStudent } from '@server/modules/students/student.schema';
import 'rxjs/add/operator/switchMap';
import { StudentService } from '@client/core/student/student.service';

@Component({
  selector: 'app-admin-edit-student',
  templateUrl: './admin-edit-student.component.html',
  styleUrls: ['./admin-edit-student.component.scss']
})
export class AdminEditStudentComponent implements OnInit {

  student: IStudent;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly studentService: StudentService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .switchMap( (params: ParamMap) =>
        this.studentService.getStudent(params.get('id'))).subscribe((student: IStudent) => {
        this.student = student;
      }
    );
  }

}
