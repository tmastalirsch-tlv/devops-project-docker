import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DinosaursModule } from './dinosaurs/dinosaurs.module';
import { ParksModule } from './parks/parks.module';
import { VisitorsModule } from './visitors/visitors.module';
import { StaffModule } from './staff/staff.module';
import { IncidentsModule } from './incidents/incidents.module';

@Module({
  imports: [
    DinosaursModule,
    ParksModule,
    VisitorsModule,
    StaffModule,
    IncidentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
