import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
export class CreateEmailVerificationTokenDto {
    @ApiProperty()
    @IsNumberString()
    user_id!: string;
}
