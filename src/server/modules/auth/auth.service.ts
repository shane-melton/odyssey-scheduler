import {Component, Inject} from '@nestjs/common';
import { IAdminCredentials, IAuthResult, IAuthToken } from '@shared/interfaces/Auth';
import {Constants, ProviderTokens} from '@server/constants';
import * as jwt from 'jsonwebtoken';
import { AvailableRoles } from '@server/helpers/roles';
import {FailureResult, IApiResult} from '@shared/interfaces/api';
import * as moment from 'moment';
import {Model} from 'mongoose';
import {StudentDocument} from '@server/modules/students/student.schema';

@Component()
export class AuthService {

  constructor(@Inject(ProviderTokens.Student) private readonly studentModel: Model<StudentDocument>,) {}

  async authorizeAdmin(credentials: IAdminCredentials): Promise<IAuthResult> {
    return Promise.resolve(this._createToken(credentials.username, true));
  }

  async authorizeStudent(studentNumber: string, birthdate: Date): Promise<IApiResult> {
    if (await this.verifyStudent(studentNumber, birthdate)) {
      return this._createToken(studentNumber, false);
    } else {
      return new FailureResult('Student not found!');
    }
  }

  async verifyStudent(studentNumber: string, birthDate: Date): Promise<boolean> {

    birthDate = moment(birthDate).startOf('day').toDate();

    const student = await this.studentModel.findOne({studentNumber, birthDate}).exec();

    return !!student;
  }
  /**
   * Determines if a user has the any of the {@link roles} specified. If no roles are provided then true is returned;
   * if no user is provided and roles are provided then false is returned.
   * @param {UserToken} verifiedUser
   * @param {string[]} roles
   * @returns {boolean}
   */
  userHasRoles(verifiedUser: IAuthToken, roles: string[]): boolean {
    // If there are no roles then we automatically validate
    if (!roles || roles.length === 0) {
      return true;
    }

    // If there is no user then they cannot have any roles
    if (!verifiedUser) {
      return false;
    }

    const userRoles = this._buildUserRoles(verifiedUser);
    return !!userRoles.find((role) => !!roles.find((item) => item === role));
  }

  private _createToken(id: string, isAdmin: boolean = false): IAuthResult {
    const idObj = (isAdmin) ? {adminId: id} : {studentNumber: id};
    const token: IAuthToken = {isAdmin, ...idObj};
    const expiresIn = (isAdmin) ? Constants.AdminExpiresIn : Constants.StudentExpiresIn;

    const signedToken = jwt.sign(token, Constants.JWTSecret, {expiresIn});

    return {
      success: true,
      token: signedToken,
      expiresIn
    };
  }

  /**
   * Constructs an array of roles based on the provided verified user token
   * @param {UserToken} verifiedUser
   * @returns {string[]}
   */
  private _buildUserRoles(verifiedUser: IAuthToken): string[] {
    const userRoles = [];

    if (verifiedUser.isAdmin) {
      userRoles.push(AvailableRoles.ADMIN);
    }

    if (!verifiedUser.isAdmin && verifiedUser.studentNumber) {
      userRoles.push(AvailableRoles.STUDENT);
    }

    return userRoles;
  }

}
