export type UserRole = 'ELDER' | 'CAREGIVER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ElderProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city: string;
  state: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  yearsOfExperience: number;
  hourlyRate: number;
  availableFrom: string;
  availableTo: string;
  city: string;
  state: string;
  skills: string[];
  phone?: string;
  verified?: boolean;
}

export interface CareRequest {
  id: string;
  elderId: string;
  elderName?: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  state: string;
  status: 'OPEN' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';
  assignedCaregiverId?: string;
  createdAt: string;
}

export interface CareApplication {
  id: string;
  careRequestId: string;
  caregiverProfileId: string;
  caregiverName: string;
  caregiverBio?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  appliedAt: string;
}
