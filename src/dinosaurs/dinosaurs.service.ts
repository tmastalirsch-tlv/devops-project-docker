import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDinosaurDto } from './dto/create-dinosaur.dto';
import { UpdateDinosaurDto } from './dto/update-dinosaur.dto';
import { Dinosaur } from './entities/dinosaur.entity';

@Injectable()
export class DinosaursService {
  private dinosaurs: Dinosaur[] = [
    {
      id: '1',
      name: 'Blue',
      species: 'Velociraptor',
      diet: 'carnivore',
      period: 'cretaceous',
      height: 1.8,
      weight: 20,
      dangerLevel: 5,
      enclosureId: 'raptor-paddock-1',
      description: 'Highly intelligent pack hunter with excellent problem-solving skills',
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15'),
      healthStatus: 'excellent',
      lastFed: new Date('2024-01-15T08:00:00Z'),
      mood: 'calm'
    },
    {
      id: '2',
      name: 'Rexy',
      species: 'Tyrannosaurus Rex',
      diet: 'carnivore',
      period: 'cretaceous',
      height: 6.0,
      weight: 9000,
      dangerLevel: 5,
      enclosureId: 't-rex-kingdom',
      description: 'The queen of the island, apex predator with immense power',
      isActive: true,
      createdAt: new Date('2022-06-10'),
      updatedAt: new Date('2024-01-14'),
      healthStatus: 'good',
      lastFed: new Date('2024-01-14T14:00:00Z'),
      mood: 'sleeping'
    },
    {
      id: '3',
      name: 'Bumpy',
      species: 'Ankylosaurus',
      diet: 'herbivore',
      period: 'cretaceous',
      height: 2.5,
      weight: 6000,
      dangerLevel: 2,
      enclosureId: 'herbivore-valley',
      description: 'Gentle giant with protective armor plating',
      isActive: true,
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-01-15'),
      healthStatus: 'excellent',
      lastFed: new Date('2024-01-15T10:00:00Z'),
      mood: 'playful'
    }
  ];

  create(createDinosaurDto: CreateDinosaurDto): Dinosaur {
    const newDinosaur: Dinosaur = {
      id: (this.dinosaurs.length + 1).toString(),
      ...createDinosaurDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      healthStatus: 'good',
      mood: 'calm'
    };
    
    this.dinosaurs.push(newDinosaur);
    return newDinosaur;
  }

  findAll(filter?: { diet?: string; dangerLevel?: number; enclosureId?: string; isActive?: boolean }): Dinosaur[] {
    let filteredDinosaurs = this.dinosaurs;

    if (filter) {
      if (filter.diet) {
        filteredDinosaurs = filteredDinosaurs.filter(dino => dino.diet === filter.diet);
      }
      if (filter.dangerLevel) {
        filteredDinosaurs = filteredDinosaurs.filter(dino => dino.dangerLevel === filter.dangerLevel);
      }
      if (filter.enclosureId) {
        filteredDinosaurs = filteredDinosaurs.filter(dino => dino.enclosureId === filter.enclosureId);
      }
      if (filter.isActive !== undefined) {
        filteredDinosaurs = filteredDinosaurs.filter(dino => dino.isActive === filter.isActive);
      }
    }

    return filteredDinosaurs;
  }

  findOne(id: string): Dinosaur {
    const dinosaur = this.dinosaurs.find(dino => dino.id === id);
    if (!dinosaur) {
      throw new NotFoundException(`Dinosaur with ID ${id} not found`);
    }
    return dinosaur;
  }

  update(id: string, updateDinosaurDto: UpdateDinosaurDto): Dinosaur {
    const dinosaurIndex = this.dinosaurs.findIndex(dino => dino.id === id);
    if (dinosaurIndex === -1) {
      throw new NotFoundException(`Dinosaur with ID ${id} not found`);
    }

    this.dinosaurs[dinosaurIndex] = {
      ...this.dinosaurs[dinosaurIndex],
      ...updateDinosaurDto,
      updatedAt: new Date()
    };

    return this.dinosaurs[dinosaurIndex];
  }

  remove(id: string): void {
    const dinosaurIndex = this.dinosaurs.findIndex(dino => dino.id === id);
    if (dinosaurIndex === -1) {
      throw new NotFoundException(`Dinosaur with ID ${id} not found`);
    }
    this.dinosaurs.splice(dinosaurIndex, 1);
  }

  feedDinosaur(id: string): Dinosaur {
    const dinosaur = this.findOne(id);
    dinosaur.lastFed = new Date();
    dinosaur.mood = 'calm';
    dinosaur.updatedAt = new Date();
    return dinosaur;
  }

  getDinosaursBySpecies(): { [species: string]: number } {
    const speciesCount: { [species: string]: number } = {};
    this.dinosaurs.forEach(dino => {
      speciesCount[dino.species] = (speciesCount[dino.species] || 0) + 1;
    });
    return speciesCount;
  }

  getDangerousdinosaurs(): Dinosaur[] {
    return this.dinosaurs.filter(dino => dino.dangerLevel >= 4 && dino.isActive);
  }
}
