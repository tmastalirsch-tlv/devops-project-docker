import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }

  @Get()
  findAll(
    @Query('ticketType') ticketType?: string,
    @Query('visitStatus') visitStatus?: string,
    @Query('visitDate') visitDate?: string,
    @Query('accessLevel') accessLevel?: string,
  ) {
    const filter: any = {};
    if (ticketType) filter.ticketType = ticketType;
    if (visitStatus) filter.visitStatus = visitStatus;
    if (visitDate) filter.visitDate = visitDate;
    if (accessLevel) filter.accessLevel = accessLevel;

    return this.visitorsService.findAll(filter);
  }

  @Get('statistics')
  getVisitorStatistics() {
    return {
      message: 'Visitor statistics and current status',
      data: this.visitorsService.getVisitorStatistics()
    };
  }

  @Post('emergency/evacuate')
  @HttpCode(HttpStatus.OK)
  emergencyEvacuation() {
    return {
      message: 'Emergency evacuation initiated',
      data: this.visitorsService.emergencyEvacuation()
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorsService.update(id, updateVisitorDto);
  }

  @Post(':id/checkin')
  @HttpCode(HttpStatus.OK)
  checkIn(@Param('id') id: string) {
    return {
      message: `Visitor ${id} checked in successfully`,
      data: this.visitorsService.checkIn(id)
    };
  }

  @Post(':id/checkout')
  @HttpCode(HttpStatus.OK)
  checkOut(@Param('id') id: string) {
    return {
      message: `Visitor ${id} checked out successfully`,
      data: this.visitorsService.checkOut(id)
    };
  }

  @Post(':id/waivers')
  @HttpCode(HttpStatus.OK)
  signWaivers(@Param('id') id: string) {
    return {
      message: `Waivers signed for visitor ${id}`,
      data: this.visitorsService.signWaivers(id)
    };
  }

  @Patch(':id/location')
  updateLocation(@Param('id') id: string, @Body('location') location: string) {
    return {
      message: `Location updated for visitor ${id}`,
      data: this.visitorsService.updateLocation(id, location)
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(id);
  }
}
