import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcome() {
    return {
      message: 'Welcome to Jurassic World API',
      version: '1.0.0',
      description: 'Complete park management system for Jurassic World operations',
      endpoints: {
        dinosaurs: '/dinosaurs - Manage dinosaur assets',
        enclosures: '/parks/enclosures - Manage park enclosures and facilities',
        visitors: '/visitors - Visitor management and tracking',
        staff: '/staff - Staff and ranger management',
        incidents: '/incidents - Incident reporting and emergency management'
      },
      status: this.appService.getSystemStatus()
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        dinosaur_management: 'online',
        park_operations: 'online',
        visitor_services: 'online',
        staff_management: 'online',
        incident_response: 'online'
      }
    };
  }
}
