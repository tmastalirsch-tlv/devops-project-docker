import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ParksService } from './parks.service';
import { CreateEnclosureDto } from './dto/create-enclosure.dto';
import { UpdateEnclosureDto } from './dto/update-enclosure.dto';

@Controller('parks/enclosures')
export class ParksController {
  constructor(private readonly parksService: ParksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEnclosureDto: CreateEnclosureDto) {
    return this.parksService.create(createEnclosureDto);
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('securityLevel') securityLevel?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filter: any = {};
    if (type) filter.type = type;
    if (securityLevel) filter.securityLevel = parseInt(securityLevel);
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    return this.parksService.findAll(filter);
  }

  @Get('reports/capacity')
  getCapacityReport() {
    return {
      message: 'Park capacity utilization report',
      data: this.parksService.getCapacityReport()
    };
  }

  @Get('reports/security')
  getSecurityReport() {
    return {
      message: 'High-risk enclosures requiring attention',
      data: this.parksService.getSecurityReport()
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnclosureDto: UpdateEnclosureDto) {
    return this.parksService.update(id, updateEnclosureDto);
  }

  @Post(':id/inspect')
  @HttpCode(HttpStatus.OK)
  performInspection(@Param('id') id: string) {
    return {
      message: `Enclosure ${id} inspection completed`,
      data: this.parksService.performInspection(id)
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.parksService.remove(id);
  }
}
