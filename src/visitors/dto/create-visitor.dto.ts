export class CreateVisitorDto {
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
}
