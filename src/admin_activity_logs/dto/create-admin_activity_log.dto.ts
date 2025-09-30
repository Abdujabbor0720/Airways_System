import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsObject, IsOptional, IsString } from 'class-validator';
export class CreateAdminActivityLogDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    admin_user_id?: string;
    @ApiProperty()
    @IsString()
    action!: string;
    @ApiProperty()
    @IsString()
    entity_type!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    entity_id?: string;
    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    details?: Record<string, unknown>;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ip?: string;
}
