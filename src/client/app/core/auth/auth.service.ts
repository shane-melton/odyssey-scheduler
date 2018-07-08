import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAdminCredentials, IAuthResult, IAuthToken } from '@shared/interfaces/Auth';
import { decode } from 'jsonwebtoken';

import * as moment from 'moment';
import { AUTH_EXPIRES_KEY, AUTH_TOKEN_KEY } from '../../constants/auth.constants';
import { AuthApi } from '@shared/api-endpoints';
import { Moment } from 'moment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {

  private _authToken: IAuthToken;
  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this._loadSavedSession();
  }

  get AuthStatus$(): BehaviorSubject<boolean> {
    return this._loggedIn;
  }

  // region Public Getters
  get studentNumber(): string {
    return this.isStudent && this._authToken.studentNumber;
  }

  get adminId(): string {
    return this.isAdmin && this._authToken.adminId;
  }

  get isLoggedIn(): boolean {
    return this._authToken && moment().isBefore(this._getExpiration());
  }

  get isStudent(): boolean {
    return this.isLoggedIn && !this._authToken.isAdmin;
  }

  get isAdmin(): boolean {
    return this.isLoggedIn && this._authToken.isAdmin;
  }

  get sessionExpiration(): Moment {
    return this._getExpiration();
  }
  // endregion

  // region Public Methods
  /**
   * Sends a request to the server to login as an administrator using a username and password
   * @param {string} username
   * @param {string} password
   */
  public loginAdmin(credentials: IAdminCredentials): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post<IAuthResult>(AuthApi.postAuthAdmin, credentials)
        .subscribe(authResult => {
          if (authResult.success) {
            this._setSession(authResult);
            resolve();
          } else {
            reject(authResult.errorMsg);
          }
        });
    });
  }

  /**
   * Sends a request to the server to login as a student/parent using a student number
   * @param {string} studentNumber
   * @param {Date} birthdate
   */
  public loginStudent(studentNumber: string, birthdate: Date): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post<IAuthResult>(AuthApi.postAuthStudent, {studentNumber, birthdate})
        .subscribe(authResult => {
          if (authResult.success) {
            this._setSession(authResult);
            resolve();
          } else {
            reject(authResult.errorMsg);
          }
        });
    });
  }

  /**
   * Clears any currently authenticated students or administrators and clears any JWT
   */
  public logout(): void {
    this._authToken = null;
    localStorage.removeItem(AUTH_EXPIRES_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this._loggedIn.next(false);
  }
  // endregion

  // region Private Methods
  private _setSession(authResult: IAuthResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem(AUTH_TOKEN_KEY, authResult.token);
    localStorage.setItem(AUTH_EXPIRES_KEY, JSON.stringify(expiresAt.valueOf()));

    this._authToken = decode(authResult.token) as IAuthToken;

    this._loggedIn.next(true);
  }

  private _loadSavedSession() {
    if (this.sessionExpiration.isAfter(moment())) {
      const tokenValue = localStorage.getItem(AUTH_TOKEN_KEY);

      if (tokenValue) {
        this._authToken = decode(tokenValue) as IAuthToken;
        this._loggedIn.next(true);
      }
    }
  }

  private _getExpiration() {
    const expiration = localStorage.getItem(AUTH_EXPIRES_KEY);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  // endregion
}
