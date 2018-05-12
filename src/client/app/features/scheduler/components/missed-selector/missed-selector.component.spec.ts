import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedSelectorComponent } from './missed-selector.component';

describe('MissedSelectorComponent', () => {
  let component: MissedSelectorComponent;
  let fixture: ComponentFixture<MissedSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissedSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
