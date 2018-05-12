import { IApiResult } from '@shared/interfaces/api';

export interface IAuthResult extends IApiResult {
  readonly token: string;
  readonly expiresIn: number;
}
