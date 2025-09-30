import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';
export class CreateFlightCrewDto {
    @ApiProperty()
    @IsNumberString()
    flight_instance_id!: string;
    @ApiProperty()
    @IsNumberString()
    crew_member_id!: string;
    @ApiProperty()
    @IsString()
    duty_role!: string;
}
