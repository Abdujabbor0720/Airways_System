import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;
    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8)
    password!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    full_name?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    birth_date?: string;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    loyalty_opt_in?: boolean;
}
