import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateSupportTicketDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    booking_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    assigned_admin_id?: string;
    @ApiProperty()
    @IsString()
    subject!: string;
    @ApiPropertyOptional({ enum: ['GENERAL', 'BOOKING', 'REFUND', 'TECH', 'OTHER'] })
    @IsOptional()
    @IsIn(['GENERAL', 'BOOKING', 'REFUND', 'TECH', 'OTHER'])
    category?: 'GENERAL' | 'BOOKING' | 'REFUND' | 'TECH' | 'OTHER';
    @ApiPropertyOptional({ enum: ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'], default: 'OPEN' })
    @IsOptional()
    @IsIn(['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'])
    status?: 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
    @ApiPropertyOptional({ enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' })
    @IsOptional()
    @IsIn(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}
