import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appToc]'
})
export class TocDirective {
  @Input('appToc') appToc: string;

  constructor() { }

  @HostListener('click') onClick() {
    document.querySelector('#' + this.appToc).scrollIntoView({behavior: 'smooth'});
    // location.hash = this.appToc;
  }
}
