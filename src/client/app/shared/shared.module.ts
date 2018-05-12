import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleBackgroundComponent } from './bubble-background/bubble-background.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [BubbleBackgroundComponent],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    BubbleBackgroundComponent
  ]
})
export class SharedModule { }
