import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirplaneModelsService } from './airplane_models.service';
import { AirplaneModelsController } from './airplane_models.controller';
import { AirplaneModel } from './entities/airplane_model.entity';
@Module({
    imports: [TypeOrmModule.forFeature([AirplaneModel])],
    controllers: [AirplaneModelsController],
    providers: [AirplaneModelsService],
})
export class AirplaneModelsModule {
}
