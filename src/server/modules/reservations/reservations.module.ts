import { Module } from '@nestjs/common';
import { reservationProviders } from '@server/modules/reservations/reservation.schema';


@Module({
  imports: [],
  controllers: [],
  components: [...reservationProviders],
  exports: [...reservationProviders]
})
export class ReservationsModule {

}
