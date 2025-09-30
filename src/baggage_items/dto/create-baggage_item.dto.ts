import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsOptional, Matches } from 'class-validator';
export class CreateBaggageItemDto {
    @ApiProperty()
    @IsNumberString()
    ticket_coupon_id!: string;
    @ApiProperty({ minimum: 1 })
    @IsInt()
    piece_no!: number;
    @ApiPropertyOptional({ description: 'Weight in kg (numeric string)' })
    @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/)
    weight_kg?: string;
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_carry_on?: boolean;
}
