import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrewMembersService } from './crew_members.service';
import { CreateCrewMemberDto } from './dto/create-crew_member.dto';
import { UpdateCrewMemberDto } from './dto/update-crew_member.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
@ApiTags('Crew Members')
@Controller('crew-members')
export class CrewMembersController {
    constructor(private readonly crewMembersService: CrewMembersService) { }
    @Post()
    @ApiOperation({ summary: 'Create crew member' })
    create(
    @Body()
    createCrewMemberDto: CreateCrewMemberDto) {
        return this.crewMembersService.create(createCrewMemberDto);
    }
    @Get()
    @ApiOperation({ summary: 'List crew members with pagination' })
    findAll(
    @Query()
    page: PaginationDto) {
        return this.crewMembersService.findAll(page);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get crew member by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.crewMembersService.findOne(id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update crew member' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updateCrewMemberDto: UpdateCrewMemberDto) {
        return this.crewMembersService.update(id, updateCrewMemberDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete crew member' })
    remove(
    @Param('id')
    id: string) {
        return this.crewMembersService.remove(id);
    }
}
