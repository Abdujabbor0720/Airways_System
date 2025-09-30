import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumberString, IsOptional } from 'class-validator';
export class UpdateTicketsCouponDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    ticket_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    flight_instance_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    fare_class_id?: string;
    @ApiPropertyOptional({ minimum: 1 })
    @IsOptional()
    @IsInt()
    sequence_no?: number;
    @ApiPropertyOptional({ enum: ['OPEN', 'FLOWN', 'VOID', 'REFUNDED'] })
    @IsOptional()
    @IsIn(['OPEN', 'FLOWN', 'VOID', 'REFUNDED'])
    coupon_status?: 'OPEN' | 'FLOWN' | 'VOID' | 'REFUNDED';
}
