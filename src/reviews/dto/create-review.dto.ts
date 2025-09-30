import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateReviewDto {
    @ApiProperty()
    @IsNumberString()
    user_id!: string;
    @ApiPropertyOptional({ description: 'Flight ID' })
    @IsOptional()
    @IsNumberString()
    flight_id?: string;
    @ApiPropertyOptional({ description: 'Airline ID' })
    @IsOptional()
    @IsNumberString()
    airline_id?: string;
    @ApiProperty({ minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    comment?: string;
}
