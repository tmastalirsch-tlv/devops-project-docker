import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';

@Injectable()
export class VisitorsService {
  private visitors: Visitor[] = [
    {
      id: 'visitor-1',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah.connor@email.com',
      phone: '+1-555-0123',
      age: 35,
      ticketType: 'vip',
      emergencyContact: {
        name: 'John Connor',
        phone: '+1-555-0124',
        relationship: 'Son'
      },
      medicalConditions: [],
      visitDate: new Date('2024-01-15'),
      groupSize: 2,
      checkInTime: new Date('2024-01-15T09:00:00Z'),
      currentLocation: 'Main Visitor Center',
      visitStatus: 'checked_in',
      waiversSigned: true,
      accessLevel: 'behind_scenes',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15T09:00:00Z')
    },
    {
      id: 'visitor-2',
      firstName: 'Alan',
      lastName: 'Grant',
      email: 'a.grant@paleontology.edu',
      phone: '+1-555-0456',
      age: 45,
      ticketType: 'researcher',
      emergencyContact: {
        name: 'Ellie Sattler',
        phone: '+1-555-0457',
        relationship: 'Colleague'
      },
      medicalConditions: [],
      visitDate: new Date('2024-01-15'),
      groupSize: 1,
      checkInTime: new Date('2024-01-15T08:30:00Z'),
      currentLocation: 'Herbivore Valley',
      visitStatus: 'on_tour',
      waiversSigned: true,
      accessLevel: 'research',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15T10:30:00Z')
    }
  ];

  create(createVisitorDto: CreateVisitorDto): Visitor {
    const accessLevel = this.determineAccessLevel(createVisitorDto.ticketType);
    
    const newVisitor: Visitor = {
      id: `visitor-${Date.now()}`,
      ...createVisitorDto,
      visitStatus: 'scheduled',
      waiversSigned: false,
      accessLevel,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.visitors.push(newVisitor);
    return newVisitor;
  }

  findAll(filter?: { 
    ticketType?: string; 
    visitStatus?: string; 
    visitDate?: string;
    accessLevel?: string;
  }): Visitor[] {
    let filteredVisitors = this.visitors;

    if (filter) {
      if (filter.ticketType) {
        filteredVisitors = filteredVisitors.filter(visitor => visitor.ticketType === filter.ticketType);
      }
      if (filter.visitStatus) {
        filteredVisitors = filteredVisitors.filter(visitor => visitor.visitStatus === filter.visitStatus);
      }
      if (filter.visitDate) {
        const filterDate = new Date(filter.visitDate);
        filteredVisitors = filteredVisitors.filter(visitor => 
          visitor.visitDate.toDateString() === filterDate.toDateString()
        );
      }
      if (filter.accessLevel) {
        filteredVisitors = filteredVisitors.filter(visitor => visitor.accessLevel === filter.accessLevel);
      }
    }

    return filteredVisitors;
  }

  findOne(id: string): Visitor {
    const visitor = this.visitors.find(v => v.id === id);
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
    return visitor;
  }

  update(id: string, updateVisitorDto: UpdateVisitorDto): Visitor {
    const visitorIndex = this.visitors.findIndex(v => v.id === id);
    if (visitorIndex === -1) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    this.visitors[visitorIndex] = {
      ...this.visitors[visitorIndex],
      ...updateVisitorDto,
      updatedAt: new Date()
    };

    return this.visitors[visitorIndex];
  }

  remove(id: string): void {
    const visitorIndex = this.visitors.findIndex(v => v.id === id);
    if (visitorIndex === -1) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
    this.visitors.splice(visitorIndex, 1);
  }

  checkIn(id: string): Visitor {
    const visitor = this.findOne(id);
    
    if (visitor.visitStatus !== 'scheduled') {
      throw new BadRequestException(`Visitor ${id} is not scheduled for check-in`);
    }

    if (!visitor.waiversSigned) {
      throw new BadRequestException(`Visitor ${id} must sign waivers before check-in`);
    }

    visitor.checkInTime = new Date();
    visitor.visitStatus = 'checked_in';
    visitor.currentLocation = 'Main Visitor Center';
    visitor.updatedAt = new Date();

    return visitor;
  }

  checkOut(id: string): Visitor {
    const visitor = this.findOne(id);
    
    if (!['checked_in', 'on_tour'].includes(visitor.visitStatus)) {
      throw new BadRequestException(`Visitor ${id} is not eligible for check-out`);
    }

    visitor.checkOutTime = new Date();
    visitor.visitStatus = 'checked_out';
    visitor.currentLocation = undefined;
    visitor.updatedAt = new Date();

    return visitor;
  }

  signWaivers(id: string): Visitor {
    const visitor = this.findOne(id);
    visitor.waiversSigned = true;
    visitor.updatedAt = new Date();
    return visitor;
  }

  updateLocation(id: string, location: string): Visitor {
    const visitor = this.findOne(id);
    
    if (visitor.visitStatus !== 'checked_in' && visitor.visitStatus !== 'on_tour') {
      throw new BadRequestException(`Cannot update location for visitor ${id} with status ${visitor.visitStatus}`);
    }

    visitor.currentLocation = location;
    visitor.visitStatus = location === 'Main Visitor Center' ? 'checked_in' : 'on_tour';
    visitor.updatedAt = new Date();

    return visitor;
  }

  emergencyEvacuation(): Visitor[] {
    const evacuatedVisitors = this.visitors.filter(v => 
      v.visitStatus === 'checked_in' || v.visitStatus === 'on_tour'
    );

    evacuatedVisitors.forEach(visitor => {
      visitor.visitStatus = 'emergency_evacuated';
      visitor.currentLocation = 'Emergency Assembly Point';
      visitor.updatedAt = new Date();
    });

    return evacuatedVisitors;
  }

  getVisitorStatistics(): {
    totalVisitors: number;
    todayVisitors: number;
    checkedInCount: number;
    onTourCount: number;
    ticketTypeDistribution: { [key: string]: number };
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisitors = this.visitors.filter(v => 
      v.visitDate >= today && v.visitDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    );

    const checkedInCount = this.visitors.filter(v => v.visitStatus === 'checked_in').length;
    const onTourCount = this.visitors.filter(v => v.visitStatus === 'on_tour').length;

    const ticketTypeDistribution: { [key: string]: number } = {};
    this.visitors.forEach(visitor => {
      ticketTypeDistribution[visitor.ticketType] = (ticketTypeDistribution[visitor.ticketType] || 0) + 1;
    });

    return {
      totalVisitors: this.visitors.length,
      todayVisitors: todayVisitors.length,
      checkedInCount,
      onTourCount,
      ticketTypeDistribution
    };
  }

  private determineAccessLevel(ticketType: string): 'basic' | 'restricted' | 'behind_scenes' | 'research' {
    switch (ticketType) {
      case 'researcher':
        return 'research';
      case 'vip':
        return 'behind_scenes';
      case 'staff_family':
        return 'restricted';
      default:
        return 'basic';
    }
  }
}
