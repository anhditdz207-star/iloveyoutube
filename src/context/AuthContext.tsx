import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GoogleUserProfile } from '@/types/music';
import { auth, googleProvider, signInWithPopup, firebaseSignOut } from '@/services/firebase';

interface AuthContextType {
  user: GoogleUserProfile | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGooglePopup: () => Promise<void>;
  loginWithGoogleProfile: (profile: { name: string; email: string; avatar?: string }) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'iloveyoutube_google_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginWithGooglePopup = async () => {
    try {
      if (auth) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const profile: GoogleUserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Người dùng Google',
          email: fbUser.email || 'user@gmail.com',
          avatar:
            fbUser.photoURL ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          isLoggedIn: true,
          joinedAt: Date.now(),
        };
        setUser(profile);
        setIsLoginModalOpen(false);
        return;
      }
    } catch (err: any) {
      console.warn('Firebase signInWithPopup:', err);
    }

    // Graceful fallback: prompt or default Google demo login
    loginWithGoogleProfile({
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    });
  };

  const loginWithGoogleProfile = ({
    name,
    email,
    avatar,
  }: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    const defaultAvatar =
      avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email || name)}`;
    const newProfile: GoogleUserProfile = {
      id: `google-${Date.now()}`,
      name: name || 'Người dùng YouTube',
      email: email || 'user@gmail.com',
      avatar: defaultAvatar,
      isLoggedIn: true,
      joinedAt: Date.now(),
    };
    setUser(newProfile);
    setIsLoginModalOpen(false);
  };

  const logout = async () => {
    try {
      if (auth) await firebaseSignOut(auth);
    } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithGooglePopup,
        loginWithGoogleProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
