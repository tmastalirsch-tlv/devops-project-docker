export class Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  position: 'park_ranger' | 'veterinarian' | 'security' | 'maintenance' | 'researcher' | 'tour_guide' | 'manager' | 'emergency_response';
  department: 'operations' | 'security' | 'research' | 'veterinary' | 'maintenance' | 'guest_services' | 'administration';
  clearanceLevel: 1 | 2 | 3 | 4 | 5;
  hireDate: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  certifications: string[];
  isActive: boolean;
  currentAssignment?: string;
  shift: 'day' | 'night' | 'rotating' | 'on_call';
  status: 'on_duty' | 'off_duty' | 'on_break' | 'emergency_response' | 'unavailable';
  lastCheckIn?: Date;
  performanceRating: 1 | 2 | 3 | 4 | 5; // 1 = needs improvement, 5 = excellent
  trainings: {
    name: string;
    completedDate: Date;
    expiryDate?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
