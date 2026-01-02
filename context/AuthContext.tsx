import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { mockUsers, syncAllData } from '../services/mockData';
import bcrypt from 'bcryptjs';

type AuthResult = {
  success: boolean;
  message?: string;
};

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: Role) => AuthResult;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'isActive' | 'profilePicture'>) => AuthResult;
  updateUser: (updatedData: Partial<User> & { id: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (identifier: string, password: string, role: Role): AuthResult => {
    const lowercasedIdentifier = identifier.toLowerCase();
    const foundUser = mockUsers.find(
      u => (u.gmail.toLowerCase() === lowercasedIdentifier || u.username.toLowerCase() === lowercasedIdentifier) && u.role === role
    );
    
    if (!foundUser) {
        return { success: false, message: 'Email/Username atau role tidak cocok.' };
    }

    const stored = foundUser.password;
    let passwordMatches = false;
    if (stored && typeof stored === 'string' && stored.startsWith('$2')) {
      passwordMatches = bcrypt.compareSync(password, stored);
    } else {
      passwordMatches = stored === password;
    }

    if (!passwordMatches) {
      return { success: false, message: 'Password salah.' };
    }

    if (!foundUser.isActive) {
      return { success: false, message: 'Akun Anda telah dinonaktifkan.' };
    }
    
    setUser(foundUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };
  
  const register = (userData: Omit<User, 'id' | 'isActive' | 'profilePicture'>): AuthResult => {
    if (!userData.password || userData.password.length < 6) {
        return { success: false, message: 'Password minimal 6 karakter.' };
    }

    if (mockUsers.some(u => u.gmail.toLowerCase() === userData.gmail.toLowerCase())) {
        return { success: false, message: 'Email sudah terdaftar.' };
    }
    if (mockUsers.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
        return { success: false, message: 'Username sudah terdaftar.' };
    }

    const hashed = bcrypt.hashSync(userData.password, 8);

    const newUser: User = {
      id: mockUsers.length + 1,
      profilePicture: `https://i.pravatar.cc/150?u=${userData.username}`,
      isActive: true,
      ...userData,
      password: hashed
    };
    mockUsers.push(newUser); // In a real app, this would be an API call
    syncAllData();
    return { success: true, message: 'Registrasi berhasil.' };
  };

  const updateUser = (updatedData: Partial<User> & { id: number }) => {
    // Update mock data array
    const userIndex = mockUsers.findIndex(u => u.id === updatedData.id);
    if (userIndex !== -1) {
      // If password being updated, hash it before saving
      if (updatedData.password && typeof updatedData.password === 'string' && !updatedData.password.startsWith('$2')) {
        updatedData.password = bcrypt.hashSync(updatedData.password, 8);
      }
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedData };
      syncAllData();
    }
    // Update current user state if it's the same user
    if (user && user.id === updatedData.id) {
        setUser(prevUser => ({ ...prevUser!, ...updatedData }));
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
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
