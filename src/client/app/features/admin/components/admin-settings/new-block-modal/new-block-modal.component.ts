import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Modal, FormSelect, Timepicker, Chips, ChipData } from 'materialize-css';
import * as _ from 'underscore';
import { BlockApi } from '@shared/api-endpoints';
import { IApiResult } from '@shared/interfaces/api';
import { HttpClient } from '@angular/common/http';
import { BlockService } from '@client/core/blocks/block.service';

@Component({
  selector: 'app-new-block-modal',
  templateUrl: './new-block-modal.component.html',
  styleUrls: ['./new-block-modal.component.scss']
})
export class NewBlockModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modal') private _modalRef: ElementRef;
  private _modal: Modal;

  blockForm: FormGroup;

  grades = [
    { value: 9, text: '9th' },
    { value: 10, text: '10th' },
    { value: 11, text: '11th' },
    { value: 12, text: '12th' }
  ];

  days = [
    { value: 1, text: 'Monday' },
    { value: 2, text: 'Tuesday' },
    { value: 3, text: 'Wednesday' },
    { value: 4, text: 'Thursday' },
    { value: 5, text: 'Friday' }
  ];

  constructor(private fb: FormBuilder, private blockService: BlockService) {
    this.createForm();
  }

  ngOnInit() {
    this._modal = new Modal(this._modalRef.nativeElement, {
      dismissible: false
    });

  }

  /**
   * After the view initial renders (including the <option />'s) initialize materialize inputs
   */
  ngAfterViewInit() {
    const self = this;
    // Select Inputs
    FormSelect.init(document.querySelectorAll('select'), {});

    // Time Pickers
    Timepicker.init(document.querySelectorAll('.timepicker'), {
      container: 'body',
      autoClose: true,
      onCloseEnd: function() {
        const event = new Event('input', {
          'bubbles': true,
          'cancelable': true
        });
        this.el.dispatchEvent(event);
      }
    });

    // Chips
    Chips.init(document.querySelectorAll('.chips'), {
      placeholder: 'Enter rooms',
      secondaryPlaceholder: 'add new room',
      onChipDelete: updateRooms,
      onChipAdd: updateRooms
    });

    // Function to update room selections since Chips do not automatically update form values
    function updateRooms() {
      self.blockForm.patchValue({
        rooms: _.map(this.chipsData, (chipData: ChipData) => chipData.tag)
      });
    }

    M.updateTextFields();
  }

  public open() {
    this._modal.open();
  }

  public submitForm() {
    this.blockService.createBlock(this.blockForm.value);
  }

  private createForm() {
    this.blockForm = this.fb.group({
      name: ['', Validators.required],
      grades: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      maxStudents: [0, [Validators.required, Validators.min(0)]],
      days: [[], Validators.required],
      makeupDays: [[], Validators.required],
      rooms: [[], Validators.required],
    });
  }

}
