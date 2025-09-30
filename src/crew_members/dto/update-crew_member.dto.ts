import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateCrewMemberDto } from './create-crew_member.dto';
export class UpdateCrewMemberDto extends PartialType(CreateCrewMemberDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    qualification?: string;
    @ApiPropertyOptional({ description: 'Unique passport or ID number' })
    @IsOptional()
    @IsString()
    identification_document?: string;
}
