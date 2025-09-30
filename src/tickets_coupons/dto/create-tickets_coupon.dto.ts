import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumberString, IsOptional } from 'class-validator';
export class CreateTicketsCouponDto {
    @ApiProperty()
    @IsNumberString()
    ticket_id!: string;
    @ApiProperty()
    @IsNumberString()
    flight_instance_id!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    fare_class_id?: string;
    @ApiProperty({ minimum: 1 })
    @IsInt()
    sequence_no!: number;
    @ApiPropertyOptional({ enum: ['OPEN', 'FLOWN', 'VOID', 'REFUNDED'] })
    @IsOptional()
    @IsIn(['OPEN', 'FLOWN', 'VOID', 'REFUNDED'])
    coupon_status?: 'OPEN' | 'FLOWN' | 'VOID' | 'REFUNDED';
}
