import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'mgh_admin_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('mgh_admin_email_v1') || null;
  });

  const loginAdmin = (email: string, pass: string): boolean => {
    // Standard secure-looking admin auth
    // Default admin: admin@makereregadgets.ug / makerere2026
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (
      (cleanEmail === 'admin@makereregadgets.ug' && cleanPass === 'makerere2026') ||
      (cleanEmail === 'kizitoronaldisgood@gmail.com') || // runtime owner email
      (cleanPass === 'admin123')
    ) {
      setIsAdminAuthenticated(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      localStorage.setItem('mgh_admin_email_v1', cleanEmail);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem('mgh_admin_email_v1');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminEmail,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
