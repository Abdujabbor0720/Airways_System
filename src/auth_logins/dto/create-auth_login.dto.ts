import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIP, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateAuthLoginDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    admin_user_id?: string;
    @ApiPropertyOptional()
    @IsBoolean()
    success!: boolean;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ip?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    user_agent?: string;
}
