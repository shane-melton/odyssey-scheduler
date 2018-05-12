import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeupSelectorComponent } from './makeup-selector.component';

describe('MakeupSelectorComponent', () => {
  let component: MakeupSelectorComponent;
  let fixture: ComponentFixture<MakeupSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeupSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
