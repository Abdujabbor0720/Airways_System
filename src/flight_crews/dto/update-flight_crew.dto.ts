import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
export class UpdateFlightCrewDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    flight_instance_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    crew_member_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    duty_role?: string;
}
