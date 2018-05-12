import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerContainerComponent } from './scheduler-container.component';

describe('SchedulerContainerComponent', () => {
  let component: SchedulerContainerComponent;
  let fixture: ComponentFixture<SchedulerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
