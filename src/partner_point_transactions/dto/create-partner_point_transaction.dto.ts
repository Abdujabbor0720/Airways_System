import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreatePartnerPointTransactionDto {
    @ApiProperty()
    @IsNumberString()
    partner_id!: string;
    @ApiProperty()
    @IsNumberString()
    user_id!: string;
    @ApiProperty()
    @IsInt()
    points_delta!: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;
}
