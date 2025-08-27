export class Enclosure {
  id: string;
  name: string;
  type: 'herbivore' | 'carnivore' | 'aquatic' | 'aviary' | 'mixed';
  maxCapacity: number;
  currentOccupancy: number;
  securityLevel: 1 | 2 | 3 | 4 | 5;
  area: number; // in square meters
  climate: 'tropical' | 'temperate' | 'arid' | 'arctic' | 'wetland';
  isActive: boolean;
  description?: string;
  fenceType: 'electric' | 'concrete' | 'steel' | 'water' | 'glass';
  hasPowerBackup: boolean;
  lastInspection?: Date;
  maintenanceStatus: 'excellent' | 'good' | 'needs_attention' | 'critical';
  emergencyProtocols: string[];
  createdAt: Date;
  updatedAt: Date;
}
