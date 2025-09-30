import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator';
export class CreateNotificationDto {
    @ApiPropertyOptional({ description: 'User ID' })
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiPropertyOptional({ description: 'Admin user ID' })
    @IsOptional()
    @IsNumberString()
    admin_user_id?: string;
    @ApiProperty({ enum: ['EMAIL', 'SMS', 'PUSH'] })
    @IsIn(['EMAIL', 'SMS', 'PUSH'])
    channel!: 'EMAIL' | 'SMS' | 'PUSH';
    @ApiProperty()
    @IsString()
    purpose!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    to_address?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    subject?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    body?: string;
    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    payload?: Record<string, unknown>;
}
