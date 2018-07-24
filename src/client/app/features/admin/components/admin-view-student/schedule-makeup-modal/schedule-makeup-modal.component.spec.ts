import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMakeupModalComponent } from './schedule-makeup-modal.component';

describe('ScheduleMakeupModalComponent', () => {
  let component: ScheduleMakeupModalComponent;
  let fixture: ComponentFixture<ScheduleMakeupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleMakeupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleMakeupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
