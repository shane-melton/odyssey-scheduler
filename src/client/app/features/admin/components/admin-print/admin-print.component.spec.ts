import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrintComponent } from './admin-print.component';

describe('AdminPrintComponent', () => {
  let component: AdminPrintComponent;
  let fixture: ComponentFixture<AdminPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
