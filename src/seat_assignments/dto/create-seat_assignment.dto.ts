import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
export class CreateSeatAssignmentDto {
    @ApiProperty()
    @IsNumberString()
    flight_instance_id!: string;
    @ApiProperty()
    @IsNumberString()
    seat_id!: string;
    @ApiProperty()
    @IsNumberString()
    ticket_coupon_id!: string;
}
