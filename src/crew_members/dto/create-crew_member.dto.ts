import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
export enum CrewRole {
    PILOT = 'PILOT',
    COPILOT = 'COPILOT',
    FLIGHT_ATTENDANT = 'FLIGHT_ATTENDANT',
    ENGINEER = 'ENGINEER'
}
export class CreateCrewMemberDto {
    @ApiProperty({ minLength: 2 })
    @IsString()
    full_name!: string;
    @ApiProperty({ enum: CrewRole })
    @IsEnum(CrewRole)
    role!: CrewRole;
    @ApiProperty()
    @IsDateString()
    hire_date!: string;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
    @ApiPropertyOptional({ description: 'Crew member qualification (e.g. type rating, medical)' })
    @IsOptional()
    @IsString()
    qualification?: string;
    @ApiPropertyOptional({ description: 'Unique passport or ID number' })
    @IsOptional()
    @IsString()
    identification_document?: string;
}
