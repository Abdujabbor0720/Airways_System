import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateSeatDto {
    @ApiProperty()
    @IsNumberString()
    plane_id!: string;
    @ApiProperty()
    @IsString()
    seat_number!: string;
    @ApiProperty()
    @IsNumberString()
    seat_class_id!: string;
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    extra_legroom?: boolean;
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_window?: boolean;
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_aisle?: boolean;
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_exit_row?: boolean;
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_blocked?: boolean;
}
