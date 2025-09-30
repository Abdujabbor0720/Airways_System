import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
export class CreateBookingMealDto {
    @ApiProperty()
    @IsNumberString()
    booking_id!: string;
    @ApiProperty()
    @IsNumberString()
    passenger_id!: string;
    @ApiProperty()
    @IsNumberString()
    meal_option_id!: string;
    @ApiProperty({ required: false })
    special_request?: string;
    @ApiProperty({ required: false })
    dietary_constraint?: string;
}
