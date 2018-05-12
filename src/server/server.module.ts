import { MiddlewaresConsumer, Module, NestModule } from '@nestjs/common';
import { EventsGateway } from './events.gateway.';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { AuthModule } from '@server/modules/auth/auth.module';
import { DatabaseModule } from '@server/database/database.module';
import { TokenMiddleware } from '@server/modules/auth/token.middleware';
import { AuthController } from '@server/modules/auth/auth.controller';
import { StudentController } from '@server/modules/students/student.controller';
import { SchedulerController } from '@server/modules/scheduler/scheduler.controller';
import { StudentModule } from '@server/modules/students/students.module';
import { ReservationsModule } from '@server/modules/reservations/reservations.module';
import { BlocksModule } from '@server/modules/blocks/blocks.module';


@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BlocksModule,
    StudentModule,
    ReservationsModule,
    SchedulerModule
  ],
  controllers: [],
  components: [EventsGateway]
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(TokenMiddleware)
      .forRoutes(AuthController, StudentController, SchedulerController);
  }
}
