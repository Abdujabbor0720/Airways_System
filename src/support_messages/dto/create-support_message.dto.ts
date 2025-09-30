import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateSupportMessageDto {
    @ApiProperty()
    @IsNumberString()
    support_ticket_id!: string;
    @ApiProperty({ enum: ['USER', 'ADMIN', 'SYSTEM'] })
    @IsIn(['USER', 'ADMIN', 'SYSTEM'])
    sender_type!: 'USER' | 'ADMIN' | 'SYSTEM';
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    sender_user_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    sender_admin_id?: string;
    @ApiProperty()
    @IsString()
    message!: string;
}
