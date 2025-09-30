import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingMealDto } from './create-booking_meal.dto';
export class UpdateBookingMealDto extends PartialType(CreateBookingMealDto) {
    @ApiProperty({ required: false })
    special_request?: string;
    @ApiProperty({ required: false })
    dietary_constraint?: string;
}
