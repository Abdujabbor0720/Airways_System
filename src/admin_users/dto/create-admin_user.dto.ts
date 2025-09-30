import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateAdminUserDto {
    @ApiProperty()
    @IsOptional()
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
    @ApiProperty({ enum: ['ADMIN', 'SUPER_ADMIN'] })
    @IsIn(['ADMIN', 'SUPER_ADMIN'])
    role!: 'ADMIN' | 'SUPER_ADMIN';
    @ApiPropertyOptional({ enum: ['ACTIVE', 'BLOCKED', 'DELETED'], default: 'ACTIVE' })
    @IsOptional()
    @IsIn(['ACTIVE', 'BLOCKED', 'DELETED'])
    status?: 'ACTIVE' | 'BLOCKED' | 'DELETED';
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_creator?: boolean;
}
