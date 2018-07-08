import { Body, Controller, Post } from '@nestjs/common';
import { AuthApi } from '@shared/api-endpoints';
import { IAdminCredentials, IAuthResult } from '@shared/interfaces/Auth';
import { FailureException, IApiResult } from '@shared/interfaces/api';
import { AuthService } from '@server/modules/auth/auth.service';


@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService) { }

  @Post(AuthApi.postAuthAdmin)
  async postAuthAdmin(@Body() credentials: IAdminCredentials): Promise<IAuthResult | IApiResult> {
    try {
      return this.authService.authorizeAdmin(credentials);
    } catch (e) {
      return new FailureException(e);
    }
  }

  @Post(AuthApi.postAuthStudent)
  async postAuthStudent(@Body('studentNumber') studentNumber: string, @Body('birthdate') birthdate: Date): Promise<IAuthResult | IApiResult> {
    try {
      return this.authService.authorizeStudent(studentNumber, birthdate);
    } catch (e) {
      return new FailureException(e);
    }
  }

}
