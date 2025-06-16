import { TherapistUser, ApiResponse } from '../types';

// Mock authentication service
class AuthService {
  private readonly STORAGE_KEY = 'isana_auth_token';
  private readonly USER_KEY = 'isana_user';

  async login(email: string, password: string): Promise<ApiResponse<{ user: TherapistUser; token: string }>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (email === 'dr.smith@isana.com' && password === 'password123') {
      const mockUser: TherapistUser = {
        id: 'therapist-1',
        name: 'Dr. Rachel Smith',
        email: 'dr.smith@isana.com',
        phone: '(555) 123-4567',
        license: {
          number: 'LPC-12345',
          type: 'Licensed Professional Counselor',
          state: 'CA',
          expirationDate: '2025-12-31'
        },
        specializations: ['Anxiety Disorders', 'Depression', 'Trauma Therapy', 'Cognitive Behavioral Therapy'],
        credentials: ['LPC', 'EMDR', 'CBT'],
        avatar: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        preferences: {
          workingHours: {
            start: '09:00',
            end: '17:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          defaultSessionDuration: 60,
          timezone: 'America/Los_Angeles'
        },
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      };

      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem(this.STORAGE_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));

      return {
        success: true,
        message: 'Login successful',
        data: { user: mockUser, token }
      };
    }

    return {
      success: false,
      message: 'Invalid email or password',
      data: { user: {} as TherapistUser, token: '' }
    };
  }

  async logout(): Promise<ApiResponse<null>> {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    return {
      success: true,
      message: 'Logged out successfully',
      data: null
    };
  }

  async getCurrentUser(): Promise<TherapistUser | null> {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newToken = 'refreshed-jwt-token-' + Date.now();
    localStorage.setItem(this.STORAGE_KEY, newToken);
    
    return {
      success: true,
      message: 'Token refreshed',
      data: { token: newToken }
    };
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async resetPassword(email: string): Promise<ApiResponse<null>> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Password reset email sent',
      data: null
    };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentPassword === 'password123') {
      return {
        success: true,
        message: 'Password changed successfully',
        data: null
      };
    }
    
    return {
      success: false,
      message: 'Current password is incorrect',
      data: null
    };
  }
}

export const authService = new AuthService();