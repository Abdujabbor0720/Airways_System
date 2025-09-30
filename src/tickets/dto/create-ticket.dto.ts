import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';
export class CreateTicketDto {
    @ApiProperty()
    @IsNumberString()
    booking_id!: string;
    @ApiProperty()
    @IsNumberString()
    passenger_id!: string;
    @ApiProperty()
    @IsString()
    ticket_number!: string;
}
