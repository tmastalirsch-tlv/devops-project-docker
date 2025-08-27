import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEnclosureDto } from './dto/create-enclosure.dto';
import { UpdateEnclosureDto } from './dto/update-enclosure.dto';
import { Enclosure } from './entities/enclosure.entity';

@Injectable()
export class ParksService {
  private enclosures: Enclosure[] = [
    {
      id: 'raptor-paddock-1',
      name: 'Raptor Paddock Alpha',
      type: 'carnivore',
      maxCapacity: 4,
      currentOccupancy: 1,
      securityLevel: 5,
      area: 2500,
      climate: 'tropical',
      isActive: true,
      description: 'High-security enclosure for velociraptors with reinforced electric fencing',
      fenceType: 'electric',
      hasPowerBackup: true,
      lastInspection: new Date('2024-01-10'),
      maintenanceStatus: 'excellent',
      emergencyProtocols: ['Immediate lockdown', 'Asset Containment Unit deployment', 'Evacuation protocol Alpha'],
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 't-rex-kingdom',
      name: 'Tyrannosaur Kingdom',
      type: 'carnivore',
      maxCapacity: 1,
      currentOccupancy: 1,
      securityLevel: 5,
      area: 15000,
      climate: 'tropical',
      isActive: true,
      description: 'Massive enclosure for apex predators with multi-layered security systems',
      fenceType: 'concrete',
      hasPowerBackup: true,
      lastInspection: new Date('2024-01-08'),
      maintenanceStatus: 'good',
      emergencyProtocols: ['Code Red lockdown', 'Military intervention authorization', 'Island-wide evacuation'],
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: 'herbivore-valley',
      name: 'Herbivore Valley',
      type: 'herbivore',
      maxCapacity: 20,
      currentOccupancy: 1,
      securityLevel: 2,
      area: 50000,
      climate: 'temperate',
      isActive: true,
      description: 'Large open grassland for peaceful herbivorous dinosaurs',
      fenceType: 'steel',
      hasPowerBackup: false,
      lastInspection: new Date('2024-01-12'),
      maintenanceStatus: 'excellent',
      emergencyProtocols: ['Standard containment', 'Guest evacuation if needed'],
      createdAt: new Date('2022-02-15'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  create(createEnclosureDto: CreateEnclosureDto): Enclosure {
    const newEnclosure: Enclosure = {
      id: `enclosure-${Date.now()}`,
      ...createEnclosureDto,
      currentOccupancy: 0,
      lastInspection: new Date(),
      maintenanceStatus: 'excellent',
      emergencyProtocols: ['Standard containment protocol'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.enclosures.push(newEnclosure);
    return newEnclosure;
  }

  findAll(filter?: { type?: string; securityLevel?: number; isActive?: boolean }): Enclosure[] {
    let filteredEnclosures = this.enclosures;

    if (filter) {
      if (filter.type) {
        filteredEnclosures = filteredEnclosures.filter(enc => enc.type === filter.type);
      }
      if (filter.securityLevel) {
        filteredEnclosures = filteredEnclosures.filter(enc => enc.securityLevel === filter.securityLevel);
      }
      if (filter.isActive !== undefined) {
        filteredEnclosures = filteredEnclosures.filter(enc => enc.isActive === filter.isActive);
      }
    }

    return filteredEnclosures;
  }

  findOne(id: string): Enclosure {
    const enclosure = this.enclosures.find(enc => enc.id === id);
    if (!enclosure) {
      throw new NotFoundException(`Enclosure with ID ${id} not found`);
    }
    return enclosure;
  }

  update(id: string, updateEnclosureDto: UpdateEnclosureDto): Enclosure {
    const enclosureIndex = this.enclosures.findIndex(enc => enc.id === id);
    if (enclosureIndex === -1) {
      throw new NotFoundException(`Enclosure with ID ${id} not found`);
    }

    this.enclosures[enclosureIndex] = {
      ...this.enclosures[enclosureIndex],
      ...updateEnclosureDto,
      updatedAt: new Date()
    };

    return this.enclosures[enclosureIndex];
  }

  remove(id: string): void {
    const enclosureIndex = this.enclosures.findIndex(enc => enc.id === id);
    if (enclosureIndex === -1) {
      throw new NotFoundException(`Enclosure with ID ${id} not found`);
    }

    const enclosure = this.enclosures[enclosureIndex];
    if (enclosure.currentOccupancy > 0) {
      throw new BadRequestException(`Cannot remove enclosure ${id} - still contains ${enclosure.currentOccupancy} dinosaur(s)`);
    }

    this.enclosures.splice(enclosureIndex, 1);
  }

  performInspection(id: string): Enclosure {
    const enclosure = this.findOne(id);
    enclosure.lastInspection = new Date();
    enclosure.updatedAt = new Date();
    
    // Simulate inspection results
    const inspectionResults = ['excellent', 'good', 'needs_attention'];
    enclosure.maintenanceStatus = inspectionResults[Math.floor(Math.random() * inspectionResults.length)] as any;
    
    return enclosure;
  }

  getCapacityReport(): { totalEnclosures: number; totalCapacity: number; totalOccupancy: number; utilizationRate: number } {
    const totalEnclosures = this.enclosures.length;
    const totalCapacity = this.enclosures.reduce((sum, enc) => sum + enc.maxCapacity, 0);
    const totalOccupancy = this.enclosures.reduce((sum, enc) => sum + enc.currentOccupancy, 0);
    const utilizationRate = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;

    return {
      totalEnclosures,
      totalCapacity,
      totalOccupancy,
      utilizationRate: Math.round(utilizationRate * 100) / 100
    };
  }

  getSecurityReport(): Enclosure[] {
    return this.enclosures.filter(enc => 
      enc.securityLevel >= 4 || 
      enc.maintenanceStatus === 'critical' || 
      enc.maintenanceStatus === 'needs_attention'
    );
  }
}
