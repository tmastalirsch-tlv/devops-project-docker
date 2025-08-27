export class UpdateStaffDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employeeId?: string;
  position?: 'park_ranger' | 'veterinarian' | 'security' | 'maintenance' | 'researcher' | 'tour_guide' | 'manager' | 'emergency_response';
  department?: 'operations' | 'security' | 'research' | 'veterinary' | 'maintenance' | 'guest_services' | 'administration';
  clearanceLevel?: 1 | 2 | 3 | 4 | 5; // 1 = basic, 5 = maximum clearance
  hireDate?: Date;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  certifications?: string[];
  isActive?: boolean;
}
