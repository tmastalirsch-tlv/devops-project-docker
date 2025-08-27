import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  private staff: Staff[] = [
    {
      id: 'staff-1',
      firstName: 'Owen',
      lastName: 'Grady',
      email: 'owen.grady@jurassicworld.com',
      phone: '+1-555-0001',
      employeeId: 'EMP-001',
      position: 'park_ranger',
      department: 'operations',
      clearanceLevel: 5,
      hireDate: new Date('2020-01-15'),
      emergencyContact: {
        name: 'Claire Dearing',
        phone: '+1-555-0002',
        relationship: 'Partner'
      },
      certifications: ['Animal Behavior Specialist', 'Emergency Response', 'Firearms Training'],
      isActive: true,
      currentAssignment: 'Raptor Paddock Alpha',
      shift: 'day',
      status: 'on_duty',
      lastCheckIn: new Date('2024-01-15T08:00:00Z'),
      performanceRating: 5,
      trainings: [
        {
          name: 'Raptor Behavior Management',
          completedDate: new Date('2023-12-01'),
          expiryDate: new Date('2024-12-01')
        },
        {
          name: 'Emergency Protocols',
          completedDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-01-01')
        }
      ],
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date('2024-01-15T08:00:00Z')
    },
    {
      id: 'staff-2',
      firstName: 'Claire',
      lastName: 'Dearing',
      email: 'claire.dearing@jurassicworld.com',
      phone: '+1-555-0002',
      employeeId: 'EMP-002',
      position: 'manager',
      department: 'administration',
      clearanceLevel: 5,
      hireDate: new Date('2019-06-01'),
      emergencyContact: {
        name: 'Owen Grady',
        phone: '+1-555-0001',
        relationship: 'Partner'
      },
      certifications: ['Park Management', 'Crisis Management', 'Safety Protocols'],
      isActive: true,
      currentAssignment: 'Main Operations Center',
      shift: 'day',
      status: 'on_duty',
      lastCheckIn: new Date('2024-01-15T07:30:00Z'),
      performanceRating: 5,
      trainings: [
        {
          name: 'Park Operations Management',
          completedDate: new Date('2023-11-15'),
          expiryDate: new Date('2024-11-15')
        }
      ],
      createdAt: new Date('2019-06-01'),
      updatedAt: new Date('2024-01-15T07:30:00Z')
    },
    {
      id: 'staff-3',
      firstName: 'Barry',
      lastName: 'Sembène',
      email: 'barry.sembene@jurassicworld.com',
      phone: '+1-555-0003',
      employeeId: 'EMP-003',
      position: 'park_ranger',
      department: 'operations',
      clearanceLevel: 4,
      hireDate: new Date('2021-03-10'),
      emergencyContact: {
        name: 'Marie Sembène',
        phone: '+1-555-0004',
        relationship: 'Wife'
      },
      certifications: ['Animal Handling', 'First Aid', 'Security Protocols'],
      isActive: true,
      currentAssignment: 'Herbivore Valley',
      shift: 'day',
      status: 'on_duty',
      lastCheckIn: new Date('2024-01-15T08:15:00Z'),
      performanceRating: 4,
      trainings: [
        {
          name: 'Herbivore Care',
          completedDate: new Date('2023-10-20'),
          expiryDate: new Date('2024-10-20')
        }
      ],
      createdAt: new Date('2021-03-10'),
      updatedAt: new Date('2024-01-15T08:15:00Z')
    }
  ];

  create(createStaffDto: CreateStaffDto): Staff {
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      ...createStaffDto,
      shift: 'day',
      status: 'off_duty',
      performanceRating: 3,
      trainings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.staff.push(newStaff);
    return newStaff;
  }

  findAll(filter?: { 
    position?: string; 
    department?: string; 
    clearanceLevel?: number;
    status?: string;
    isActive?: boolean;
  }): Staff[] {
    let filteredStaff = this.staff;

    if (filter) {
      if (filter.position) {
        filteredStaff = filteredStaff.filter(staff => staff.position === filter.position);
      }
      if (filter.department) {
        filteredStaff = filteredStaff.filter(staff => staff.department === filter.department);
      }
      if (filter.clearanceLevel) {
        filteredStaff = filteredStaff.filter(staff => staff.clearanceLevel >= filter.clearanceLevel);
      }
      if (filter.status) {
        filteredStaff = filteredStaff.filter(staff => staff.status === filter.status);
      }
      if (filter.isActive !== undefined) {
        filteredStaff = filteredStaff.filter(staff => staff.isActive === filter.isActive);
      }
    }

    return filteredStaff;
  }

  findOne(id: string): Staff {
    const staff = this.staff.find(s => s.id === id);
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return staff;
  }

  update(id: string, updateStaffDto: UpdateStaffDto): Staff {
    const staffIndex = this.staff.findIndex(s => s.id === id);
    if (staffIndex === -1) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }

    this.staff[staffIndex] = {
      ...this.staff[staffIndex],
      ...updateStaffDto,
      updatedAt: new Date()
    };

    return this.staff[staffIndex];
  }

  remove(id: string): void {
    const staffIndex = this.staff.findIndex(s => s.id === id);
    if (staffIndex === -1) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    this.staff.splice(staffIndex, 1);
  }

  checkIn(id: string): Staff {
    const staff = this.findOne(id);
    
    if (!staff.isActive) {
      throw new BadRequestException(`Staff member ${id} is not active`);
    }

    staff.status = 'on_duty';
    staff.lastCheckIn = new Date();
    staff.updatedAt = new Date();

    return staff;
  }

  checkOut(id: string): Staff {
    const staff = this.findOne(id);
    
    if (staff.status === 'off_duty') {
      throw new BadRequestException(`Staff member ${id} is already off duty`);
    }

    staff.status = 'off_duty';
    staff.currentAssignment = undefined;
    staff.updatedAt = new Date();

    return staff;
  }

  assignTask(id: string, assignment: string): Staff {
    const staff = this.findOne(id);
    
    if (staff.status !== 'on_duty') {
      throw new BadRequestException(`Staff member ${id} must be on duty to receive assignments`);
    }

    staff.currentAssignment = assignment;
    staff.updatedAt = new Date();

    return staff;
  }

  emergencyResponse(): Staff[] {
    const availableStaff = this.staff.filter(s => 
      s.isActive && 
      (s.status === 'on_duty' || s.status === 'on_break') &&
      s.clearanceLevel >= 3
    );

    availableStaff.forEach(staff => {
      staff.status = 'emergency_response';
      staff.currentAssignment = 'Emergency Response Protocol';
      staff.updatedAt = new Date();
    });

    return availableStaff;
  }

  addTraining(id: string, training: { name: string; expiryDate?: Date }): Staff {
    const staff = this.findOne(id);
    
    const newTraining = {
      name: training.name,
      completedDate: new Date(),
      expiryDate: training.expiryDate
    };

    staff.trainings.push(newTraining);
    staff.updatedAt = new Date();

    return staff;
  }

  getStaffStatistics(): {
    totalStaff: number;
    onDutyCount: number;
    offDutyCount: number;
    emergencyResponseCount: number;
    departmentDistribution: { [key: string]: number };
    averagePerformanceRating: number;
  } {
    const onDutyCount = this.staff.filter(s => s.status === 'on_duty').length;
    const offDutyCount = this.staff.filter(s => s.status === 'off_duty').length;
    const emergencyResponseCount = this.staff.filter(s => s.status === 'emergency_response').length;

    const departmentDistribution: { [key: string]: number } = {};
    this.staff.forEach(staff => {
      departmentDistribution[staff.department] = (departmentDistribution[staff.department] || 0) + 1;
    });

    const totalRating = this.staff.reduce((sum, staff) => sum + staff.performanceRating, 0);
    const averagePerformanceRating = this.staff.length > 0 ? totalRating / this.staff.length : 0;

    return {
      totalStaff: this.staff.length,
      onDutyCount,
      offDutyCount,
      emergencyResponseCount,
      departmentDistribution,
      averagePerformanceRating: Math.round(averagePerformanceRating * 100) / 100
    };
  }

  getExpiringCertifications(daysAhead: number = 30): Staff[] {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.staff.filter(staff => 
      staff.trainings.some(training => 
        training.expiryDate && training.expiryDate <= futureDate
      )
    );
  }
}
