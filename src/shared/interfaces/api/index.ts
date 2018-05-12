import { HttpException } from '@nestjs/common';

export interface IApiResult<T = void> {
  success: boolean;
  errorMsg?: string;
  exception?:  HttpException;

  data?: T;
}

export class SuccesResult<T> implements IApiResult<T> {
  success: boolean;
  data: T;

  constructor(data: T = null) {
    this.success = true;
    this.data = data;
  }
}

export class FailureResult implements IApiResult<void> {
  success: boolean;
  errorMsg: string;

  constructor(errorMsg: string) {
    this.success = false;
    this.errorMsg = errorMsg;
  }

}

export class FailureException implements IApiResult<void> {
  success: boolean;
  exception:  HttpException;
  private _errorMsg: string;

  get errorMsg(): string {
    return this._errorMsg ? this._errorMsg : this.exception.getResponse()['message'];
  }

  constructor(exception: HttpException, errorMsg: string = null) {
    this.success = false;
    this.exception = exception;
    this._errorMsg = errorMsg;
  }
}
