export class CreateEnclosureDto {
  name: string;
  type: 'herbivore' | 'carnivore' | 'aquatic' | 'aviary' | 'mixed';
  maxCapacity: number;
  securityLevel: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = maximum security
  area: number; // in square meters
  climate: 'tropical' | 'temperate' | 'arid' | 'arctic' | 'wetland';
  isActive: boolean;
  description?: string;
  fenceType: 'electric' | 'concrete' | 'steel' | 'water' | 'glass';
  hasPowerBackup: boolean;
}
