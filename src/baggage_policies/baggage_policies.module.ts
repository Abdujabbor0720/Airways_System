import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaggagePoliciesService } from './baggage_policies.service';
import { BaggagePoliciesController } from './baggage_policies.controller';
import { BaggagePolicy } from './entities/baggage_policy.entity';
@Module({
    imports: [TypeOrmModule.forFeature([BaggagePolicy])],
    controllers: [BaggagePoliciesController],
    providers: [BaggagePoliciesService],
})
export class BaggagePoliciesModule {
}
