import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatClassesService } from './seat_classes.service';
import { SeatClassesController } from './seat_classes.controller';
import { SeatClass } from './entities/seat_class.entity';
@Module({
    imports: [TypeOrmModule.forFeature([SeatClass])],
    controllers: [SeatClassesController],
    providers: [SeatClassesService],
})
export class SeatClassesModule {
}
