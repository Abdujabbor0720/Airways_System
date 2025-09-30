import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, Matches } from 'class-validator';
export class CreateBaggagePolicyDto {
    @ApiPropertyOptional()
    @IsNumberString()
    airline_id!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    seat_class_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    max_pieces?: number;
    @ApiPropertyOptional()
    @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/)
    max_weight_kg?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    carry_on_pieces?: number;
    @ApiPropertyOptional()
    @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/)
    carry_on_weight_kg?: string;
    @ApiPropertyOptional()
    @IsOptional()
    notes?: string;
}
