import { Global, Module } from '@nestjs/common';
import { AuthController } from '@server/modules/auth/auth.controller';
import { AuthService } from '@server/modules/auth/auth.service';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { DatabaseModule } from '@server/database/database.module';

@Global()
@Module({
  imports: [],
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
