import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

// Tự động chuẩn hóa tên tiếng Việt nếu localStorage bị lỗi font hoặc dấu hỏi chấm
const sanitizeUserData = (userData) => {
  if (!userData) return null;
  let name = userData.fullName || '';
  if (name.includes('?') || name.includes('Ã') || name.includes('Û') || name.includes('?')) {
    if (userData.email === 'admin@school.edu') name = 'Lê Nguyễn Ngọc Duy Anh (Quản trị viên)';
    else if (userData.email === 'tech@school.edu') name = 'Kỹ thuật viên Nguyễn Văn Trực';
    else if (userData.email === 'student@school.edu') name = 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)';
    else name = name.replace(/[?Û]/g, '').trim();
  }
  return {
    ...userData,
    fullName: name,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const clean = sanitizeUserData(parsed);
        if (clean && clean.fullName !== parsed.fullName) {
          localStorage.setItem('user', JSON.stringify(clean));
        }
        return clean;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(identifier, password);
      const data = res.data;
      const rawUser = {
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      const userData = sanitizeUserData(rawUser);

      setToken(data.token);
      setUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại thông tin!';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isTechnician = user?.role === 'TECHNICIAN' || user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'LECTURER';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        isAdmin,
        isTechnician,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
