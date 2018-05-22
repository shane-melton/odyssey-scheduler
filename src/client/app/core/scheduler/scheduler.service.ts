import { Injectable } from '@angular/core';
import { IClassBlockDto, IClassDto, ISchoolDayDto } from '@shared/interfaces/scheduler/ISchoolDay';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { IApiResult } from '@shared/interfaces/api';
import { SchedulingApi } from '@shared/api-endpoints';
import { map } from 'rxjs/operators';

@Injectable()
export class SchedulerService {

  private _selectedMissedClass: IClassDto;
  private _selectedMakeupClass: IClassDto;

  constructor(private readonly http: HttpClient) { }

  // region Public Getters

  get MissedSelection(): IClassDto {
    return this._selectedMissedClass;
  }

  get MakeupSelection(): IClassDto {
    return this._selectedMakeupClass;
  }

  // endregion

  // region Public Methods

  setMissedSelection(block: IClassBlockDto, classDate: Date) {
    this._selectedMissedClass = {
      block,
      classDate
    };
  }

  setMakeupSelection(block: IClassBlockDto, classDate: Date) {
    this._selectedMakeupClass = {
      block,
      classDate
    };
  }

  clearSelections() {
    this._selectedMissedClass = null;
    this._selectedMakeupClass = null;
  }

  getAvailableMakeupClasses(missedClass: IClassDto = null): Observable<ISchoolDayDto[]> {
    const mClass = missedClass || this._selectedMissedClass;

    if (mClass == null) {
      throw Observable.throw('No missing class provided or selected!');
    }

    const params = new HttpParams()
      .set('date', moment(mClass.classDate).format('MM/DD/YYYY'))
      .set('blockId', mClass.block.blockId);

    return this.http.get<IApiResult<ISchoolDayDto[]>>(SchedulingApi.getAvailableClasses, {params})
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  getRecentClasses(): Observable<ISchoolDayDto[]> {
    return this.http.get<IApiResult<ISchoolDayDto[]>>(SchedulingApi.getRecentClasses)
      .pipe(
        map(res => res.success ? res.data : [])
      );
  }

  makeReservationForCurrentSelection(): Observable<IApiResult> {
    return this.makeReservation(this._selectedMissedClass, this._selectedMakeupClass);
  }

  makeReservation(missedClass: IClassDto, makeupClass: IClassDto): Observable<IApiResult> {
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

  // endregion

}
