import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator';
export class CreateBookingHistoryDto {
    @ApiProperty()
    @IsNumberString()
    booking_id!: string;
    @ApiProperty()
    @IsString()
    action!: string;
    @ApiProperty({ enum: ['USER', 'ADMIN', 'SYSTEM'] })
    @IsIn(['USER', 'ADMIN', 'SYSTEM'])
    actor_type!: 'USER' | 'ADMIN' | 'SYSTEM';
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    actor_id?: string;
    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    details?: Record<string, unknown>;
    @ApiProperty({ minLength: 3 })
    @IsString()
    state!: string;
}
