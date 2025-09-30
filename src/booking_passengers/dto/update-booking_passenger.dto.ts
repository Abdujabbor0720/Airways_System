import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingPassengerDto } from './create-booking_passenger.dto';
export class UpdateBookingPassengerDto extends PartialType(CreateBookingPassengerDto) {
    @ApiProperty({ required: false, enum: ['PASSPORT', 'ID', 'BIRTH_CERT'] })
    document_type?: 'PASSPORT' | 'ID' | 'BIRTH_CERT';
    @ApiProperty({ required: false })
    document_number?: string;
    @ApiProperty({ required: false, enum: ['M', 'F', 'X'] })
    gender?: 'M' | 'F' | 'X';
    @ApiProperty({ required: false })
    nationality_country_id?: string;
    @ApiProperty({ required: false })
    is_primary_contact?: boolean;
}
