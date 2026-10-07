import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/student';

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateAdminProfile: (updated: Partial<AdminUser>) => void;
  showLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const DEFAULT_ADMIN: AdminUser = {
  username: 'admin',
  name: 'Hadi Controller',
  email: 'admin@hadi.edu',
  role: 'Dean of Examinations / Administrator',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  isAuthenticated: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('hadi_admin_session');
      if (saved) {
        return JSON.parse(saved);
      }
      // Start logged in as default admin so everything is immediately active & usable, but admin can log out anytime to test guest mode!
      return DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  const [storedCredentials, setStoredCredentials] = useState<{ username: string; password: string }>(() => {
    try {
      const saved = localStorage.getItem('hadi_admin_credentials');
      return saved ? JSON.parse(saved) : { username: 'admin', password: 'admin123' };
    } catch {
      return { username: 'admin', password: 'admin123' };
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hadi_admin_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('hadi_admin_session');
    }
  }, [user]);

  const login = (usernameInput: string, passwordInput: string) => {
    const trimmedUser = usernameInput.trim().toLowerCase();
    const expectedUser = storedCredentials.username.toLowerCase();

    if (
      (trimmedUser === expectedUser || trimmedUser === 'admin@hadi.edu') &&
      passwordInput === storedCredentials.password
    ) {
      const authUser: AdminUser = {
        ...DEFAULT_ADMIN,
        username: usernameInput,
        isAuthenticated: true
      };
      setUser(authUser);
      setShowLoginModal(false);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Use username: admin and password: admin123'
    };
  };

  const logout = () => {
    setUser(null);
  };

  const updateAdminProfile = (updated: Partial<AdminUser>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: !!user?.isAuthenticated,
        login,
        logout,
        updateAdminProfile,
        showLoginModal,
        openLoginModal: () => setShowLoginModal(true),
        closeLoginModal: () => setShowLoginModal(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
