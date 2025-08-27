import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('location') location?: string,
    @Query('reportedBy') reportedBy?: string,
  ) {
    const filter: any = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (location) filter.location = location;
    if (reportedBy) filter.reportedBy = reportedBy;

    return this.incidentsService.findAll(filter);
  }

  @Get('statistics')
  getIncidentStatistics() {
    return {
      message: 'Incident statistics and analysis',
      data: this.incidentsService.getIncidentStatistics()
    };
  }

  @Get('critical')
  getCriticalIncidents() {
    return {
      message: 'Active critical and catastrophic incidents',
      data: this.incidentsService.getCriticalIncidents()
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; performedBy: string; notes?: string }
  ) {
    return {
      message: `Incident ${id} status updated to ${body.status}`,
      data: this.incidentsService.updateStatus(id, body.status, body.performedBy, body.notes)
    };
  }

  @Post(':id/response-team')
  @HttpCode(HttpStatus.OK)
  assignResponseTeam(
    @Param('id') id: string,
    @Body() body: { staffIds: string[]; performedBy: string }
  ) {
    return {
      message: `Response team assigned to incident ${id}`,
      data: this.incidentsService.assignResponseTeam(id, body.staffIds, body.performedBy)
    };
  }

  @Post(':id/timeline')
  @HttpCode(HttpStatus.OK)
  addTimelineEntry(
    @Param('id') id: string,
    @Body() body: { action: string; performedBy: string; notes?: string }
  ) {
    return {
      message: `Timeline entry added to incident ${id}`,
      data: this.incidentsService.addTimelineEntry(id, body.action, body.performedBy, body.notes)
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
