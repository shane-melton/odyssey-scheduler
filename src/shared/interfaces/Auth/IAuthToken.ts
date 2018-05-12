export interface IAuthToken {
  readonly isAdmin: boolean;
  readonly studentNumber?: string;
  readonly adminId?: string;
}
