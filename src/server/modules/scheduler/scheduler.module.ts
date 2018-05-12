import { Module } from '@nestjs/common';
import { SchedulerController } from '@server/modules/scheduler/scheduler.controller';
import { SchedulerService } from '@server/modules/scheduler/scheduler.service';
import { AuthModule } from '@server/modules/auth/auth.module';
import { StudentModule } from '@server/modules/students/students.module';
import { ReservationsModule } from '@server/modules/reservations/reservations.module';
import { BlocksModule } from '@server/modules/blocks/blocks.module';

@Module({
  imports: [StudentModule, ReservationsModule, BlocksModule],
  controllers: [SchedulerController],
  components: [SchedulerService]
})
export class SchedulerModule {}
