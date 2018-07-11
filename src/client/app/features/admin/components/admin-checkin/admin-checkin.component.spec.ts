import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckinComponent } from './admin-checkin.component';

describe('AdminCheckinComponent', () => {
  let component: AdminCheckinComponent;
  let fixture: ComponentFixture<AdminCheckinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCheckinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
