import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isMock } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Sync token with localStorage
  const saveToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  // Fetch MongoDB details
  const fetchDbUser = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // data contains { user, studentDetails }
        setUser({
          ...data.user,
          studentDetails: data.studentDetails
        });
      } else {
        setUser(null);
        saveToken(null);
      }
    } catch (err) {
      console.error('Error fetching DB profile:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    if (isMock) {
      // Mock flow
      if (token) {
        fetchDbUser(token).finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
    } else {
      // Firebase flow
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            saveToken(idToken);
            await fetchDbUser(idToken);
          } catch (err) {
            console.error('Firebase token fetch error:', err);
          }
        } else {
          setUser(null);
          saveToken(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isMock) {
        // Handle mock logins based on email prefix
        let mockToken = '';
        if (email.startsWith('admin')) {
          mockToken = 'mock-admin';
        } else if (email.startsWith('student5')) {
          mockToken = 'mock-student-5';
        } else if (email.startsWith('student8')) {
          mockToken = 'mock-student-8';
        } else if (email.startsWith('teacher')) {
          mockToken = 'mock-teacher';
        } else {
          mockToken = 'mock-student-5'; // Default student
        }
        saveToken(mockToken);
        await fetchDbUser(mockToken);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        saveToken(idToken);
        await fetchDbUser(idToken);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, studentClass) => {
    setLoading(true);
    try {
      if (isMock) {
        // Mock registration logic
        const mockToken = `mock-student-${studentClass || '5'}`;
        saveToken(mockToken);
        
        // Call backend registration update in mock mode
        await fetch(`${API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          },
          body: JSON.stringify({ name, phone })
        });
        
        await fetchDbUser(mockToken);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        saveToken(idToken);

        // Update name and phone in MongoDB User profile
        const profileRes = await fetch(`${API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ name, phone })
        });
        const profileData = await profileRes.json();

        // Set class and create Student entry
        if (studentClass) {
          await fetch(`${API_BASE}/admin/students/setup-class`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ 
              userId: profileData._id, 
              class: studentClass 
            })
          });
        }
        
        await fetchDbUser(idToken);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!isMock && auth) {
        await signOut(auth);
      }
      setUser(null);
      saveToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isMock }}>
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
