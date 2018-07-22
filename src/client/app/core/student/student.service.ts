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
import { IStudentDto } from '@client/dtos/IStudentDto';

@Injectable()
export class StudentService {

  private _student: IStudentDto;

  constructor(private readonly authService: AuthService,
              private readonly httpClient: HttpClient) {
    this.authService.AuthStatus$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn && this.authService.isStudent) {
        this._updateLoggedInStudent().subscribe();
      } else {
        this._student = null;
      }
    });
  }

  private _updateLoggedInStudent(): Observable<IStudentDto> {
    return this.httpClient.get<IApiResult<IStudentDto>>(StudentApi.getMe).pipe(
      map((result: IApiResult<IStudentDto>): IStudentDto => {
        if (result.success) {
          this._student = result.data;
          return result.data;
        } else {
          this._student = null;
          return null;
        }
      }));
  }

  getCurrentStudent(): Observable<IStudentDto> {
    if (this.authService.isLoggedIn && this.authService.isStudent) {
      if (this._student) {
        return Observable.of(this._student);
      } else {
        return this._updateLoggedInStudent();
      }
    }
    return Observable.of(null);
  }

  getStudent(studentNumber: string): Observable<IStudentDto> {

    if (!studentNumber) {
      return Observable.of(null);
    }

    const params = new HttpParams()
      .set('studentNumber', studentNumber);

    return this.httpClient.get<IApiResult<IStudentDto>>(StudentApi.getStudent, {params}).pipe(
      map( (result: IApiResult<IStudentDto>): IStudentDto => {
        if (result.success) {
          return result.data;
        } else {
          return null;
        }
      })
    );
  }

  updateStudent(student: IStudent): Observable<IApiResult> {
    return this.httpClient.post<IApiResult>(StudentApi.postUpdate, student);
  }

}
