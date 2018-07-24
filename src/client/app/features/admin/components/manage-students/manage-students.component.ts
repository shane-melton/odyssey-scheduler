import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ScrollSpy} from 'materialize-css';
import Modal = M.Modal;
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {

  @ViewChild('upload_modal') private _uploadModalRef: ElementRef;
  private _uploadModal: Modal;


  constructor(private readonly router: Router) { }

  goToStudent(studentNumber: string) {
    console.log(studentNumber);
    this.router.navigateByUrl(`/admin/students/${studentNumber}/view`);
  }

  ngOnInit() {
    ScrollSpy.init(document.querySelectorAll('.scrollspy'), {
      getActiveElement: function (id) {
        return 'a[appToc="' + id + '"]';
      }
    });
  }

}
