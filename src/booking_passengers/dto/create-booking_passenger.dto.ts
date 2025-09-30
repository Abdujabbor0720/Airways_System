import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNumberString, IsOptional } from 'class-validator';
export class CreateBookingPassengerDto {
    @ApiProperty()
    @IsNumberString()
    booking_id!: string;
    @ApiProperty()
    @IsNumberString()
    passenger_id!: string;
    @ApiProperty({ enum: ['ADULT', 'CHILD', 'INFANT'] })
    @IsIn(['ADULT', 'CHILD', 'INFANT'])
    passenger_type!: 'ADULT' | 'CHILD' | 'INFANT';
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_primary_contact?: boolean;
    @ApiProperty({ required: false, enum: ['PASSPORT', 'ID', 'BIRTH_CERT'] })
    document_type?: 'PASSPORT' | 'ID' | 'BIRTH_CERT';
    @ApiProperty({ required: false })
    document_number?: string;
    @ApiProperty({ required: false, enum: ['M', 'F', 'X'] })
    gender?: 'M' | 'F' | 'X';
    @ApiProperty({ required: false })
    nationality_country_id?: string;
}
