import { Module } from '@nestjs/common';
import { ParksService } from './parks.service';
import { ParksController } from './parks.controller';

@Module({
  controllers: [ParksController],
  providers: [ParksService],
  exports: [ParksService]
})
export class ParksModule {}
