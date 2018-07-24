import { Injectable } from '@angular/core';
import { IClassBlock, IClass, ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { IApiResult } from '@shared/interfaces/api';
import { SchedulingApi } from '@shared/api-endpoints';
import { map } from 'rxjs/operators';
import { IReservationDto } from '@client/dtos/IReservationDto';

@Injectable()
export class SchedulerService {

  private _selectedMissedClass: IClass;
  private _selectedMakeupClass: IClass;

  constructor(private readonly http: HttpClient) { }

  // region Public Getters

  get MissedSelection(): IClass {
    return this._selectedMissedClass;
  }

  get MakeupSelection(): IClass {
    return this._selectedMakeupClass;
  }

  // endregion

  // region Public Methods

  setMissedSelection(block: IClassBlock, classDate: Date) {
    this._selectedMissedClass = {
      block,
      classDate
    };
  }

  setMakeupSelection(block: IClassBlock, classDate: Date) {
    this._selectedMakeupClass = {
      block,
      classDate
    };
  }

  clearSelections() {
    this._selectedMissedClass = null;
    this._selectedMakeupClass = null;
  }

  getAvailableMakeupClasses(missedClass: IClass = null): Observable<ISchoolDay[]> {
    const mClass = missedClass || this._selectedMissedClass;

    if (mClass == null) {
      throw Observable.throw('No missing class provided or selected!');
    }

    const params = new HttpParams()
      .set('date', moment(mClass.classDate).format('MM/DD/YYYY'))
      .set('blockId', mClass.block.blockId);

    return this.http.get<IApiResult<ISchoolDay[]>>(SchedulingApi.getAvailableClasses, {params})
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  getRecentClasses(): Observable<ISchoolDay[]> {
    const params = new HttpParams()
      .set('future', '1');

    return this.http.get<IApiResult<ISchoolDay[]>>(SchedulingApi.getRecentClasses, {params})
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  getRecentClassesForStudent(studentNumber: string): Observable<ISchoolDay[]> {
    const params = new HttpParams()
      .set('future', '1')
      .set('studentNumber', studentNumber);

    return this.http.get<IApiResult<ISchoolDay[]>>(SchedulingApi.getRecentClassesAdmin, {params})
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  makeReservationForCurrentSelection(): Observable<IApiResult> {
    return this.makeReservation(this._selectedMissedClass, this._selectedMakeupClass);
  }

  makeReservation(missedClass: IClass, makeupClass: IClass): Observable<IApiResult> {
    if (missedClass == null) {
      throw Observable.throw('Missed class cannot be null!');
    }

    if (makeupClass == null) {
      throw Observable.throw('Makeup class cannot be null!');
    }

    const requestBody = {
      missedDate: moment(missedClass.classDate).format('MM/DD/YYYY'),
      makeupDate: moment(makeupClass.classDate).format('MM/DD/YYYY'),
      blockId: makeupClass.block.blockId
    };

    return this.http.post<IApiResult>(SchedulingApi.postReservation, requestBody);
  }

  adminMakeReservation(studentNumber: string, missedDate: Date, makeupDate: Date, blockId: string, dateRestriction: boolean): Observable<IApiResult> {
    if (missedDate == null) {
      throw Observable.throw('Missed date cannot be null!');
    }

    if (makeupDate == null) {
      throw Observable.throw('Makeup date cannot be null!');
    }

    if (blockId == null) {
      throw Observable.throw('Block cannot be null!');
    }

    const requestBody = {
      studentNumber,
      missedDate: moment(missedDate).format('MM/DD/YYYY'),
      makeupDate: moment(makeupDate).format('MM/DD/YYYY'),
      blockId,
      dateRestriction
    };

    return this.http.post<IApiResult>(SchedulingApi.postReservationAdmin, requestBody);

  }

  deleteReservation(resId: string): Observable<IApiResult> {
    return this.http.post<IApiResult>(SchedulingApi.postDeleteReservation, {resId});
  }

  listReservations(makeupDate: Date): Observable<IReservationDto[]> {
    const params = new HttpParams()
      .set('date', moment(makeupDate).format('MM/DD/YYYY'));

    return this.http.get<IApiResult<IReservationDto[]>>(SchedulingApi.getReservations, {params})
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  listReservationsForStudent(studentId: string): Observable<IReservationDto[]> {
    const params = new HttpParams()
      .set('id', studentId);

    return this.http.get<IApiResult<IReservationDto[]>>(SchedulingApi.getStudentReservations, {params})
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  updateReservationStatus(resId: string, status: boolean): Observable<boolean> {
    const requestBody = {
      id: resId,
      status
    };

    return this.http.post<IApiResult>(SchedulingApi.updateReservationStatus, requestBody)
      .pipe(
        map(res => res.success)
      );
  }

  // endregion

}
