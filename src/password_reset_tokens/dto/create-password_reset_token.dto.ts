import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
export class CreatePasswordResetTokenDto {
    @ApiProperty()
    @IsNumberString()
    user_id!: string;
}
