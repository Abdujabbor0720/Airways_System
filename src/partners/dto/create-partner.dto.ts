import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
export class CreatePartnerDto {
    @ApiProperty()
    @IsString()
    name!: string;
    @ApiProperty({ enum: ['HOTEL', 'TRANSPORT', 'BANK', 'OTHER'] })
    @IsIn(['HOTEL', 'TRANSPORT', 'BANK', 'OTHER'])
    type!: 'HOTEL' | 'TRANSPORT' | 'BANK' | 'OTHER';
}
