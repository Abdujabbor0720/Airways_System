import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FareClassesService } from './fare_classes.service';
import { FareClassesController } from './fare_classes.controller';
import { FareClass } from './entities/fare_class.entity';
@Module({
    imports: [TypeOrmModule.forFeature([FareClass])],
    controllers: [FareClassesController],
    providers: [FareClassesService],
})
export class FareClassesModule {
}
