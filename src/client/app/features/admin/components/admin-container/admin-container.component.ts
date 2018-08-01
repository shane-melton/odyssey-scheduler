import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import { StudentService } from '@client/core/student/student.service';
import { IStudent } from '@shared/interfaces/models/IStudent';
import { Autocomplete, Dropdown } from 'materialize-css';

@Component({
  selector: 'app-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss']
})
export class AdminContainerComponent implements OnInit {
  @ViewChild('search') searchBar: ElementRef;
  showSearch = false;
  showNav = true;
  searchResults: IStudent[];

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router, private readonly studentService: StudentService) {
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
    document.getElementById('overlay').addEventListener('click', (event) => {
      this.showSearch = false;
    });
  }

  runSearch(query: string) {

    if (!query || query.length < 2) {
      this.searchResults = [];
      return;
    }

    this.studentService.searchStudents(query).subscribe((students: IStudent[]) => {
      this.searchResults = students;
    });
  }

  navigateTo(student: IStudent) {
    this.router.navigateByUrl(this.studentRoute(student)).then(() => {
      this.showSearch = false;
      this.searchBar.nativeElement.value = '';
      this.searchResults = [];
    });
  }

  studentRoute(student: IStudent) {
    return '/admin/students/' + student.studentNumber + '/view';
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
