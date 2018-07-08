import { Injectable } from '@angular/core';
import {AuthService} from '@client/core/auth/auth.service';
import {IStudent} from '@server/modules/students/student.schema';
import {HttpClient} from '@angular/common/http';
import {IApiResult} from '@shared/interfaces/api';
import {StudentApi} from '@shared/api-endpoints';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';

@Injectable()
export class StudentService {

  private _student: IStudent;

  constructor(private readonly authService: AuthService,
              private readonly httpClient: HttpClient) {
    this.authService.AuthStatus$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
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

  getStudent(): Observable<IStudent> {
    console.log(this.authService.studentNumber);
    if (this.authService.isLoggedIn && this.authService.isStudent) {
      if (this._student) {
        return Observable.of(this._student);
      } else {
        return this._updateStudent();
      }
    }
    return Observable.of(null);
  }

}
