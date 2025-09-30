import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { Plane } from './entities/plane.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Plane])],
    controllers: [PlanesController],
    providers: [PlanesService],
})
export class PlanesModule {
}
