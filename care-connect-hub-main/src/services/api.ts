import { AuthResponse, User, ElderProfile, CaregiverProfile, CareRequest, CareApplication } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string; role: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Elder Profile
  async getElderProfile(): Promise<ElderProfile> {
    return this.request<ElderProfile>('/elder/profile');
  }

  async createElderProfile(data: Partial<ElderProfile>): Promise<ElderProfile> {
    return this.request<ElderProfile>('/elder/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateElderProfile(data: Partial<ElderProfile>): Promise<ElderProfile> {
    return this.request<ElderProfile>('/elder/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Caregiver Profile
  async getCaregiverProfile(): Promise<CaregiverProfile> {
    return this.request<CaregiverProfile>('/caregiver/profile');
  }

  async createCaregiverProfile(data: Partial<CaregiverProfile>): Promise<CaregiverProfile> {
    return this.request<CaregiverProfile>('/caregiver/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCaregiverProfile(data: Partial<CaregiverProfile>): Promise<CaregiverProfile> {
    return this.request<CaregiverProfile>('/caregiver/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Care Requests
  async getCareRequests(filters?: { city?: string; state?: string }): Promise<CareRequest[]> {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<CareRequest[]>(`/care-requests${query}`);
  }

  async getCareRequest(id: string): Promise<CareRequest> {
    return this.request<CareRequest>(`/care-requests/${id}`);
  }

  async createCareRequest(data: Partial<CareRequest>): Promise<CareRequest> {
    return this.request<CareRequest>('/care-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyRequests(): Promise<CareRequest[]> {
    return this.request<CareRequest[]>('/elder/care-requests');
  }

  // Applications
  async applyToCareRequest(careRequestId: string, message?: string): Promise<CareApplication> {
    return this.request<CareApplication>(`/care-requests/${careRequestId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getApplicationsForRequest(careRequestId: string): Promise<CareApplication[]> {
    return this.request<CareApplication[]>(`/care-requests/${careRequestId}/applications`);
  }

  async acceptApplication(careRequestId: string, applicationId: string): Promise<void> {
    return this.request<void>(`/care-requests/${careRequestId}/applications/${applicationId}/accept`, {
      method: 'POST',
    });
  }

  async getMyApplications(): Promise<CareApplication[]> {
    return this.request<CareApplication[]>('/caregiver/applications');
  }
}

export const apiService = new ApiService();
