import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBlockModalComponent } from './new-block-modal.component';

describe('NewBlockModalComponent', () => {
  let component: NewBlockModalComponent;
  let fixture: ComponentFixture<NewBlockModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBlockModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBlockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
