export class CreateDinosaurDto {
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
}
