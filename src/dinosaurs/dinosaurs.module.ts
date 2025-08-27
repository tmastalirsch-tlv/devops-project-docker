import { Module } from '@nestjs/common';
import { DinosaursService } from './dinosaurs.service';
import { DinosaursController } from './dinosaurs.controller';

@Module({
  controllers: [DinosaursController],
  providers: [DinosaursService],
  exports: [DinosaursService]
})
export class DinosaursModule {}
