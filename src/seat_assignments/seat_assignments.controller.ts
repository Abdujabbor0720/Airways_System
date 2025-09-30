import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SeatAssignmentsService } from './seat_assignments.service';
import { CreateSeatAssignmentDto } from './dto/create-seat_assignment.dto';
import { UpdateSeatAssignmentDto } from './dto/update-seat_assignment.dto';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiTags('Seat Assignments')
@Controller('seat-assignments')
export class SeatAssignmentsController {
    constructor(private readonly seatAssignmentsService: SeatAssignmentsService) { }
    @Post()
    @ApiOperation({ summary: 'Create seat assignment' })
    create(
    @Body()
    createSeatAssignmentDto: CreateSeatAssignmentDto) {
        return this.seatAssignmentsService.create(createSeatAssignmentDto);
    }
    @Get()
    @ApiOperation({ summary: 'List seat assignments with pagination' })
    @ApiOkResponse({ description: 'List seat assignments with pagination' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    findAll(
    @Query('limit')
    limit = 20, 
    @Query('offset')
    offset = 0) {
        return this.seatAssignmentsService.findAll(Number(offset), Math.min(Number(limit) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get seat assignment by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.seatAssignmentsService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update seat assignment' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateSeatAssignmentDto: UpdateSeatAssignmentDto) {
        return this.seatAssignmentsService.update(id, updateSeatAssignmentDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete seat assignment' })
    remove(
    @Param('id')
    id: string) {
        return this.seatAssignmentsService.remove(id);
    }
}
