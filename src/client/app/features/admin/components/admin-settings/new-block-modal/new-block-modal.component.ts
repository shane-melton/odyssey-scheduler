import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Modal, FormSelect, Timepicker, Chips, ChipData } from 'materialize-css';
import * as _ from 'underscore';
import { IApiResult } from '@shared/interfaces/api';
import { BlockService } from '@client/core/blocks/block.service';
import { EditBlockModel } from '@client/features/admin/form-models/EditBlockModel';
import { IBlock } from '@shared/interfaces/models/IBlock';

@Component({
  selector: 'app-new-block-modal',
  templateUrl: './new-block-modal.component.html',
  styleUrls: ['./new-block-modal.component.scss']
})
export class NewBlockModalComponent implements OnInit, AfterViewInit {

  @Output() saved = new EventEmitter<void>();
  @ViewChild('modal') private _modalRef: ElementRef;
  private _modal: Modal;

  blockModel: EditBlockModel;

  grades = [
    {value: 9, text: '9th'},
    {value: 10, text: '10th'},
    {value: 11, text: '11th'},
    {value: 12, text: '12th'}
  ];

  days = [
    {value: 1, text: 'Monday'},
    {value: 2, text: 'Tuesday'},
    {value: 3, text: 'Wednesday'},
    {value: 4, text: 'Thursday'},
    {value: 5, text: 'Friday'}
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
    this.initFormControls();
  }

  private initFormControls() {
    const self = this;
    // Select Inputs
    FormSelect.init(document.querySelectorAll('select'), {});

    // Time Pickers
    Timepicker.init(document.querySelectorAll('.timepicker'), {
      container: 'body',
      autoClose: true,
      onCloseEnd: function () {
        const event = new Event('input', {
          'bubbles': true,
          'cancelable': true
        });
        this.el.dispatchEvent(event);
      }
    });

    const rooms: ChipData[] = _.map(this.blockModel.rooms, (room: string): ChipData => {
      return {tag: room};
    });

    // Chips
    Chips.init(document.querySelectorAll('.chips'), {
      placeholder: 'Enter rooms',
      secondaryPlaceholder: 'add new room',
      onChipDelete: updateRooms,
      onChipAdd: updateRooms,
      data: rooms
    });

    // Function to update room selections since Chips do not automatically update form values
    function updateRooms() {
      self.blockModel.Form.patchValue({
        rooms: _.map(this.chipsData, (chipData: ChipData) => chipData.tag)
      });
    }

    M.updateTextFields();
  }

  public open(existingBlock: IBlock) {
    if (existingBlock) {
      this.createForm(existingBlock);
    } else {
      this.createForm();
    }
    this._modal.open();
  }

  public submitForm() {
    if (this.blockModel.id) {
      this.blockService.updateBlock(this.blockModel.mapToModel()).subscribe((result: IApiResult) => {
        if (result.success) {
          M.toast({html: 'Block saved successfully!'});
          this.saved.emit();
          this._modal.close();
        } else {
          M.toast({html: result.errorMsg});
        }
      });
    } else {
      this.blockService.createBlock(this.blockModel.mapToModel()).subscribe((result: IApiResult) => {
        if (result.success) {
          M.toast({html: 'Block created successfully!'});
          this.saved.emit();
          this._modal.close();
        } else {
          M.toast({html: result.errorMsg});
        }
      });
    }
  }

  private createForm(block: IBlock = null) {

    this.blockModel = new EditBlockModel(this.fb, block);

    setTimeout(() => {
      this.initFormControls();
    }, 0);
  }

}
