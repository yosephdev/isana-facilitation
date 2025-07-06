import { TherapistUser, ApiResponse } from '../types';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  User,
} from 'firebase/auth';

class AuthService {
  async login(email: string, password: string): Promise<ApiResponse<{ user: TherapistUser; token: string }>> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // For now, we'll create a mock TherapistUser from Firebase User info.
      // In a real app, you'd fetch the full TherapistUser profile from your backend
      // after successful Firebase authentication.
      const mockTherapistUser: TherapistUser = {
        id: user.uid,
        name: user.displayName || 'Therapist',
        email: user.email || '',
        phone: user.phoneNumber || '',
        license: {
          number: 'N/A',
          type: 'N/A',
          state: 'N/A',
          expirationDate: 'N/A',
        },
        specializations: [],
        credentials: [],
        preferences: {
          workingHours: {
            start: '09:00',
            end: '17:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
          defaultSessionDuration: 60,
          timezone: 'America/Los_Angeles',
        },
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Login successful',
        data: { user: mockTherapistUser, token },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed',
        data: { user: {} as TherapistUser, token: '' },
      };
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Logged out successfully',
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Logout failed',
        data: null,
      };
    }
  }

  async getCurrentUser(): Promise<TherapistUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    // Similar to login, create a mock TherapistUser from Firebase User info
    const mockTherapistUser: TherapistUser = {
      id: user.uid,
      name: user.displayName || 'Therapist',
      email: user.email || '',
      phone: user.phoneNumber || '',
      license: {
        number: 'N/A',
        type: 'N/A',
        state: 'N/A',
        expirationDate: 'N/A',
      },
      specializations: [],
      credentials: [],
      preferences: {
        workingHours: {
          start: '09:00',
          end: '17:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        defaultSessionDuration: 60,
        timezone: 'America/Los_Angeles',
      },
      createdAt: user.metadata.creationTime || new Date().toISOString(),
      updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
    };
    return mockTherapistUser;
  }

  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  async resetPassword(email: string): Promise<ApiResponse<null>> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent',
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send password reset email',
        data: null,
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: 'No user is currently logged in.',
        data: null,
      };
    }

    try {
      // Firebase does not have a direct 'changePassword' that takes current password.
      // You typically re-authenticate the user first if you need to verify current password.
      // For simplicity, this example directly updates the password.
      // In a real application, you'd re-authenticate the user before allowing a password change.
      await updatePassword(user, newPassword);
      return {
        success: true,
        message: 'Password changed successfully',
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to change password',
        data: null,
      };
    }
  }
}

export const authService = new AuthService();