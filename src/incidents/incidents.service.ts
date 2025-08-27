import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident } from './entities/incident.entity';

@Injectable()
export class IncidentsService {
  private incidents: Incident[] = [
    {
      id: 'incident-1',
      title: 'Raptor Paddock Fence Malfunction',
      description: 'Electric fence in Section B experienced power fluctuation during storm',
      type: 'equipment_failure',
      severity: 'high',
      status: 'resolved',
      location: 'Raptor Paddock Alpha - Section B',
      reportedBy: 'staff-1',
      reportedAt: new Date('2024-01-10T14:30:00Z'),
      dinosaurInvolved: '1',
      visitorsAffected: 0,
      staffAffected: 2,
      immediateActions: ['Backup power activated', 'Area secured', 'Raptor contained'],
      responseTeam: ['staff-1', 'staff-3'],
      timeline: [
        {
          timestamp: new Date('2024-01-10T14:30:00Z'),
          action: 'Incident reported',
          performedBy: 'staff-1',
          notes: 'Power fluctuation detected during routine patrol'
        },
        {
          timestamp: new Date('2024-01-10T14:35:00Z'),
          action: 'Backup power activated',
          performedBy: 'staff-1',
          notes: 'Emergency protocols initiated'
        },
        {
          timestamp: new Date('2024-01-10T15:00:00Z'),
          action: 'Incident resolved',
          performedBy: 'staff-3',
          notes: 'Primary power restored, all systems nominal'
        }
      ],
      resolution: 'Replaced faulty transformer unit, tested all backup systems',
      lessonsLearned: ['Need better weather monitoring', 'Backup response time excellent'],
      preventiveMeasures: ['Install additional surge protectors', 'Enhance storm protocols'],
      estimatedDamage: 5000,
      mediaAttention: false,
      regulatoryNotificationRequired: true,
      createdAt: new Date('2024-01-10T14:30:00Z'),
      updatedAt: new Date('2024-01-10T15:00:00Z'),
      resolvedAt: new Date('2024-01-10T15:00:00Z')
    }
  ];

  create(createIncidentDto: CreateIncidentDto): Incident {
    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      ...createIncidentDto,
      status: 'reported',
      reportedAt: new Date(),
      responseTeam: [],
      timeline: [{
        timestamp: new Date(),
        action: 'Incident reported',
        performedBy: createIncidentDto.reportedBy,
        notes: 'Initial incident report'
      }],
      mediaAttention: false,
      regulatoryNotificationRequired: this.requiresRegulatoryNotification(createIncidentDto),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.incidents.push(newIncident);
    return newIncident;
  }

  findAll(filter?: { 
    type?: string; 
    severity?: string; 
    status?: string;
    location?: string;
    reportedBy?: string;
  }): Incident[] {
    let filteredIncidents = this.incidents;

    if (filter) {
      if (filter.type) {
        filteredIncidents = filteredIncidents.filter(incident => incident.type === filter.type);
      }
      if (filter.severity) {
        filteredIncidents = filteredIncidents.filter(incident => incident.severity === filter.severity);
      }
      if (filter.status) {
        filteredIncidents = filteredIncidents.filter(incident => incident.status === filter.status);
      }
      if (filter.location) {
        filteredIncidents = filteredIncidents.filter(incident => 
          incident.location.toLowerCase().includes(filter.location.toLowerCase())
        );
      }
      if (filter.reportedBy) {
        filteredIncidents = filteredIncidents.filter(incident => incident.reportedBy === filter.reportedBy);
      }
    }

    return filteredIncidents.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  }

  findOne(id: string): Incident {
    const incident = this.incidents.find(i => i.id === id);
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  update(id: string, updateIncidentDto: UpdateIncidentDto): Incident {
    const incidentIndex = this.incidents.findIndex(i => i.id === id);
    if (incidentIndex === -1) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    this.incidents[incidentIndex] = {
      ...this.incidents[incidentIndex],
      ...updateIncidentDto,
      updatedAt: new Date()
    };

    return this.incidents[incidentIndex];
  }

  remove(id: string): void {
    const incidentIndex = this.incidents.findIndex(i => i.id === id);
    if (incidentIndex === -1) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    this.incidents.splice(incidentIndex, 1);
  }

  updateStatus(id: string, status: string, performedBy: string, notes?: string): Incident {
    const incident = this.findOne(id);
    
    incident.status = status as any;
    incident.updatedAt = new Date();
    
    if (status === 'resolved' && !incident.resolvedAt) {
      incident.resolvedAt = new Date();
    }

    incident.timeline.push({
      timestamp: new Date(),
      action: `Status updated to ${status}`,
      performedBy,
      notes
    });

    return incident;
  }

  assignResponseTeam(id: string, staffIds: string[], performedBy: string): Incident {
    const incident = this.findOne(id);
    
    incident.responseTeam = [...new Set([...incident.responseTeam, ...staffIds])];
    incident.updatedAt = new Date();

    incident.timeline.push({
      timestamp: new Date(),
      action: `Response team assigned: ${staffIds.join(', ')}`,
      performedBy,
      notes: `Total team members: ${incident.responseTeam.length}`
    });

    return incident;
  }

  addTimelineEntry(id: string, action: string, performedBy: string, notes?: string): Incident {
    const incident = this.findOne(id);
    
    incident.timeline.push({
      timestamp: new Date(),
      action,
      performedBy,
      notes
    });
    
    incident.updatedAt = new Date();
    return incident;
  }

  getIncidentStatistics(): {
    totalIncidents: number;
    openIncidents: number;
    criticalIncidents: number;
    typeDistribution: { [key: string]: number };
    severityDistribution: { [key: string]: number };
    averageResolutionTime: number; // in hours
    totalDamage: number;
  } {
    const openIncidents = this.incidents.filter(i => 
      !['resolved', 'closed'].includes(i.status)
    ).length;

    const criticalIncidents = this.incidents.filter(i => 
      ['critical', 'catastrophic'].includes(i.severity)
    ).length;

    const typeDistribution: { [key: string]: number } = {};
    const severityDistribution: { [key: string]: number } = {};

    this.incidents.forEach(incident => {
      typeDistribution[incident.type] = (typeDistribution[incident.type] || 0) + 1;
      severityDistribution[incident.severity] = (severityDistribution[incident.severity] || 0) + 1;
    });

    const resolvedIncidents = this.incidents.filter(i => i.resolvedAt);
    const totalResolutionTime = resolvedIncidents.reduce((sum, incident) => {
      return sum + (incident.resolvedAt!.getTime() - incident.reportedAt.getTime());
    }, 0);

    const averageResolutionTime = resolvedIncidents.length > 0 
      ? totalResolutionTime / resolvedIncidents.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    const totalDamage = this.incidents.reduce((sum, incident) => 
      sum + (incident.estimatedDamage || 0), 0
    );

    return {
      totalIncidents: this.incidents.length,
      openIncidents,
      criticalIncidents,
      typeDistribution,
      severityDistribution,
      averageResolutionTime: Math.round(averageResolutionTime * 100) / 100,
      totalDamage
    };
  }

  getCriticalIncidents(): Incident[] {
    return this.incidents.filter(incident => 
      ['critical', 'catastrophic'].includes(incident.severity) &&
      !['resolved', 'closed'].includes(incident.status)
    );
  }

  private requiresRegulatoryNotification(incident: CreateIncidentDto): boolean {
    return (
      incident.type === 'containment_breach' ||
      ['critical', 'catastrophic'].includes(incident.severity) ||
      (incident.visitorsAffected && incident.visitorsAffected > 0) ||
      incident.type === 'medical_emergency'
    );
  }
}
