import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FlightInstancesService } from './flight_instances.service';
import { CreateFlightInstanceDto } from './dto/create-flight_instance.dto';
import { UpdateFlightInstanceDto } from './dto/update-flight_instance.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('Flight Instances')
@Controller('flight-instances')
export class FlightInstancesController {
    constructor(private readonly flightInstancesService: FlightInstancesService) { }
    @Post()
    @ApiOperation({ summary: 'Create flight instance' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    create(
    @Body()
    createFlightInstanceDto: CreateFlightInstanceDto) {
        return this.flightInstancesService.create(createFlightInstanceDto);
    }
    @Get()
    @ApiOperation({ summary: 'List flight instances with pagination' })
    @ApiOkResponse({ description: 'List flight instances with pagination' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    findAll(limit = 20, offset = 0) {
        return this.flightInstancesService.findAll(Number(offset), Math.min(Number(limit) || 20, 100));
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get flight instance by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.flightInstancesService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update flight instance' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    update(
    @Param('id')
    id: string, 
    @Body()
    updateFlightInstanceDto: UpdateFlightInstanceDto) {
        return this.flightInstancesService.update(id, updateFlightInstanceDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete flight instance' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    remove(
    @Param('id')
    id: string) {
        return this.flightInstancesService.remove(id);
    }
    @Post(':id/status')
    @ApiOperation({ summary: 'Set status for flight instance' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiBody({ schema: { properties: { status: { type: 'string', enum: ['SCHEDULED', 'DELAYED', 'CANCELLED', 'DEPARTED', 'ARRIVED'] } }, required: ['status'] } })
    setStatus(
    @Param('id')
    id: string, 
    @Body()
    body: {
        status: 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
    }) {
        return this.flightInstancesService.setStatus(id, body.status);
    }
}
