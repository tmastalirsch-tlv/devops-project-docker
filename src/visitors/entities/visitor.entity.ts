export class Visitor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age: number;
  ticketType: 'standard' | 'vip' | 'researcher' | 'staff_family';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalConditions?: string[];
  visitDate: Date;
  groupSize: number;
  checkInTime?: Date;
  checkOutTime?: Date;
  currentLocation?: string;
  visitStatus: 'scheduled' | 'checked_in' | 'on_tour' | 'checked_out' | 'emergency_evacuated';
  waiversSigned: boolean;
  accessLevel: 'basic' | 'restricted' | 'behind_scenes' | 'research';
  createdAt: Date;
  updatedAt: Date;
}
