import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ScrollSpy} from 'materialize-css';
import Modal = M.Modal;

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {

  @ViewChild('upload_modal') private _uploadModalRef: ElementRef;
  private _uploadModal: Modal;


  constructor() { }

  ngOnInit() {
    ScrollSpy.init(document.querySelectorAll('.scrollspy'), {
      getActiveElement: function (id) {
        return 'a[appToc="' + id + '"]';
      }
    });
  }

}
