import { Injectable } from '@angular/core';
import {AuthService} from '@client/core/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import {IApiResult} from '@shared/interfaces/api';
import {StudentApi} from '@shared/api-endpoints';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import * as moment from 'moment';
import { IStudent } from '@shared/interfaces/models/IStudent';

@Injectable()
export class StudentService {

  private _student: IStudent;

  constructor(private readonly authService: AuthService,
              private readonly httpClient: HttpClient) {
    this.authService.AuthStatus$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn && this.authService.isStudent) {
        this._updateStudent().subscribe();
      } else {
        this._student = null;
      }
    });
  }

  private _updateStudent(): Observable<IStudent> {
    return this.httpClient.get<IApiResult<IStudent>>(StudentApi.getMe).pipe(
      map((result: IApiResult<IStudent>): IStudent => {
        if (result.success) {
          this._student = result.data;
          return result.data;
        } else {
          this._student = null;
          return null;
        }
      }));
  }

  getCurrentStudent(): Observable<IStudent> {
    if (this.authService.isLoggedIn && this.authService.isStudent) {
      if (this._student) {
        return Observable.of(this._student);
      } else {
        return this._updateStudent();
      }
    }
    return Observable.of(null);
  }

  getStudent(studentNumber: string): Observable<IStudent> {

    if (!studentNumber) {
      return Observable.of(null);
    }

    const params = new HttpParams()
      .set('studentNumber', studentNumber);

    return this.httpClient.get<IApiResult<IStudent>>(StudentApi.getStudent, {params}).pipe(
      map( (result: IApiResult<IStudent>): IStudent => {
        if (result.success) {
          return result.data;
        } else {
          return null;
        }
      })
    );
  }

}
