import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateReferralDto {
    @ApiProperty()
    @IsNumberString()
    referrer_user_id!: string;
    @ApiProperty()
    @IsNumberString()
    referee_user_id!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code_used?: string;
}
