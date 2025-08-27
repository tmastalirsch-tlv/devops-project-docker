export class Dinosaur {
  id: string;
  name: string;
  species: string;
  diet: 'herbivore' | 'carnivore' | 'omnivore';
  period: 'triassic' | 'jurassic' | 'cretaceous';
  height: number; // in meters
  weight: number; // in kg
  dangerLevel: 1 | 2 | 3 | 4 | 5; // 1 = very safe, 5 = extremely dangerous
  enclosureId?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastFed?: Date;
  mood: 'calm' | 'agitated' | 'aggressive' | 'sleeping' | 'playful';
}
