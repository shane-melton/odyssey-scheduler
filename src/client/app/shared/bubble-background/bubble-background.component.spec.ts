import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleBackgroundComponent } from './bubble-background.component';

describe('BubbleBackgroundComponent', () => {
  let component: BubbleBackgroundComponent;
  let fixture: ComponentFixture<BubbleBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
