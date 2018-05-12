import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSelectionComponent } from './confirm-selection.component';

describe('ConfirmSelectionComponent', () => {
  let component: ConfirmSelectionComponent;
  let fixture: ComponentFixture<ConfirmSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
