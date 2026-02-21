import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password?: string) => {
    // Check against the MOCK_USERS list
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email
      });
    } else {
      alert("Invalid email or password. Please use the credentials listed on the login page.");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};