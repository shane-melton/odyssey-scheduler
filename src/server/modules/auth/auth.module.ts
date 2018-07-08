import { Global, Module } from '@nestjs/common';
import { AuthController } from '@server/modules/auth/auth.controller';
import { AuthService } from '@server/modules/auth/auth.service';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { DatabaseModule } from '@server/database/database.module';
import {StudentModule} from '@server/modules/students/students.module';

@Global()
@Module({
  imports: [StudentModule],
  controllers: [AuthController],
  components: [
    AuthService,
    RoleGuard
  ],
  exports: [
    AuthService,
    RoleGuard
  ]
})
export class AuthModule {

}
