import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll(
    @Query('position') position?: string,
    @Query('department') department?: string,
    @Query('clearanceLevel') clearanceLevel?: string,
    @Query('status') status?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filter: any = {};
    if (position) filter.position = position;
    if (department) filter.department = department;
    if (clearanceLevel) filter.clearanceLevel = parseInt(clearanceLevel);
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    return this.staffService.findAll(filter);
  }

  @Get('statistics')
  getStaffStatistics() {
    return {
      message: 'Staff statistics and current status',
      data: this.staffService.getStaffStatistics()
    };
  }

  @Get('certifications/expiring')
  getExpiringCertifications(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days) : 30;
    return {
      message: `Staff with certifications expiring in the next ${daysAhead} days`,
      data: this.staffService.getExpiringCertifications(daysAhead)
    };
  }

  @Post('emergency/response')
  @HttpCode(HttpStatus.OK)
  emergencyResponse() {
    return {
      message: 'Emergency response team activated',
      data: this.staffService.emergencyResponse()
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Post(':id/checkin')
  @HttpCode(HttpStatus.OK)
  checkIn(@Param('id') id: string) {
    return {
      message: `Staff member ${id} checked in successfully`,
      data: this.staffService.checkIn(id)
    };
  }

  @Post(':id/checkout')
  @HttpCode(HttpStatus.OK)
  checkOut(@Param('id') id: string) {
    return {
      message: `Staff member ${id} checked out successfully`,
      data: this.staffService.checkOut(id)
    };
  }

  @Patch(':id/assign')
  assignTask(@Param('id') id: string, @Body('assignment') assignment: string) {
    return {
      message: `Assignment updated for staff member ${id}`,
      data: this.staffService.assignTask(id, assignment)
    };
  }

  @Post(':id/training')
  @HttpCode(HttpStatus.OK)
  addTraining(
    @Param('id') id: string, 
    @Body() training: { name: string; expiryDate?: Date }
  ) {
    return {
      message: `Training added for staff member ${id}`,
      data: this.staffService.addTraining(id, training)
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
