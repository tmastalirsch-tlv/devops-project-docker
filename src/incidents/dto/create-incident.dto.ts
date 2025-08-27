export class CreateIncidentDto {
  title: string;
  description: string;
  type: 'containment_breach' | 'medical_emergency' | 'security_threat' | 'equipment_failure' | 'weather_emergency' | 'visitor_incident' | 'staff_incident' | 'maintenance_issue';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'catastrophic';
  location: string;
  reportedBy: string; // Staff ID
  dinosaurInvolved?: string; // Dinosaur ID
  visitorsAffected?: number;
  staffAffected?: number;
  immediateActions?: string[];
}
