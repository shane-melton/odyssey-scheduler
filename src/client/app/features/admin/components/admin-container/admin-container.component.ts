import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss']
})
export class AdminContainerComponent implements OnInit {
  @ViewChild('search') searchBar;
  showSearch = false;
  showNav = true;

  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.firstChild.data.subscribe(data => {
      if (data['hideNav']) {
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  }

  ngOnInit() {
    this.searchBar.nativeElement.addEventListener('blur', () => {
      this.showSearch = false;
    });
  }

  setSearch(val: boolean) {
    this.showSearch = val;

    if (this.showSearch) {
      setTimeout(() => {
        this.searchBar.nativeElement.focus();
      }, 0);
    }

  }

}
