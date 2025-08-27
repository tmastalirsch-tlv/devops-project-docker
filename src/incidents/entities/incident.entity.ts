export class Incident {
  id: string;
  title: string;
  description: string;
  type: 'containment_breach' | 'medical_emergency' | 'security_threat' | 'equipment_failure' | 'weather_emergency' | 'visitor_incident' | 'staff_incident' | 'maintenance_issue';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'catastrophic';
  status: 'reported' | 'investigating' | 'responding' | 'contained' | 'resolved' | 'closed';
  location: string;
  reportedBy: string; // Staff ID
  reportedAt: Date;
  dinosaurInvolved?: string; // Dinosaur ID
  visitorsAffected?: number;
  staffAffected?: number;
  immediateActions?: string[];
  responseTeam: string[]; // Staff IDs
  timeline: {
    timestamp: Date;
    action: string;
    performedBy: string;
    notes?: string;
  }[];
  resolution?: string;
  lessonsLearned?: string[];
  preventiveMeasures?: string[];
  estimatedDamage?: number; // in USD
  mediaAttention: boolean;
  regulatoryNotificationRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
