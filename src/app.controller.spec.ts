import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getWelcome', () => {
    it('should return welcome message with API information', () => {
      const result = appController.getWelcome();
      expect(result).toHaveProperty('message', 'Welcome to Jurassic World API');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('endpoints');
      expect(result).toHaveProperty('status');
      expect(result.status).toHaveProperty('park_status', 'operational');
      expect(result.status).toHaveProperty('security_level', 'green');
    });
  });

  describe('getHealth', () => {
    it('should return health status information', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'operational');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('services');
      expect(result.services).toHaveProperty('dinosaur_management', 'online');
      expect(result.services).toHaveProperty('park_operations', 'online');
      expect(result.services).toHaveProperty('visitor_services', 'online');
      expect(result.services).toHaveProperty('staff_management', 'online');
      expect(result.services).toHaveProperty('incident_response', 'online');
    });
  });
});
