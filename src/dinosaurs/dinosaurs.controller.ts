import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { DinosaursService } from './dinosaurs.service';
import { CreateDinosaurDto } from './dto/create-dinosaur.dto';
import { UpdateDinosaurDto } from './dto/update-dinosaur.dto';

@Controller('dinosaurs')
export class DinosaursController {
  constructor(private readonly dinosaursService: DinosaursService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDinosaurDto: CreateDinosaurDto) {
    return this.dinosaursService.create(createDinosaurDto);
  }

  @Get()
  findAll(
    @Query('diet') diet?: string,
    @Query('dangerLevel') dangerLevel?: string,
    @Query('enclosureId') enclosureId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filter: any = {};
    if (diet) filter.diet = diet;
    if (dangerLevel) filter.dangerLevel = parseInt(dangerLevel);
    if (enclosureId) filter.enclosureId = enclosureId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    return this.dinosaursService.findAll(filter);
  }

  @Get('statistics/species')
  getSpeciesStatistics() {
    return {
      message: 'Dinosaur species distribution',
      data: this.dinosaursService.getDinosaursBySpecies()
    };
  }

  @Get('dangerous')
  getDangerousDinosaurs() {
    return {
      message: 'High-risk dinosaurs (danger level 4-5)',
      data: this.dinosaursService.getDangerousdinosaurs()
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dinosaursService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDinosaurDto: UpdateDinosaurDto) {
    return this.dinosaursService.update(id, updateDinosaurDto);
  }

  @Post(':id/feed')
  @HttpCode(HttpStatus.OK)
  feedDinosaur(@Param('id') id: string) {
    return {
      message: `Dinosaur ${id} has been fed successfully`,
      data: this.dinosaursService.feedDinosaur(id)
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.dinosaursService.remove(id);
  }
}
