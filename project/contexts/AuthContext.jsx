'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          profileComplete: !!userData?.vendorName,
          ...userData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const sendOTP = async (phoneNumber) => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      setVerificationId(confirmation.verificationId);
      toast.success('OTP sent successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      console.error('OTP Error:', error);
      return false;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      toast.success('Phone verified successfully!');
      return true;
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      console.error('Verification Error:', error);
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        phone: user.phone,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });

      setUser(prev => ({
        ...prev,
        ...profileData,
        profileComplete: true
      }));

      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error('Profile Error:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Failed to sign out.');
    }
  };

  const value = {
    user,
    loading,
    sendOTP,
    verifyOTP,
    updateProfile,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};