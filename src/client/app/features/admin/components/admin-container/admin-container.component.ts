import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss']
})
export class AdminContainerComponent implements OnInit {
  @ViewChild('search') searchBar;
  showSearch = false;
  showNav = true;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      mergeMap((route) => {
        return route.data;
      })
    ).subscribe((data) => {
      this.showNav = !data['hideNav'];
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
