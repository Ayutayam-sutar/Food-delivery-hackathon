import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: any) => void;
  onNavigate?: (page: string) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onNavigate }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Additional validations for signup
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call with proper error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional API failures for demo
          if (Math.random() > 0.9) {
            reject(new Error('Network error. Please try again.'));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      // Create user object
      const user = {
        id: Date.now().toString(), // Simple ID generation for demo
        name: formData.name.trim() || 'User',
        email: formData.email.trim(),
        phone: formData.phone.trim() || '+91 98765 43210',
        businessName: formData.businessName.trim() || 'My Business',
        profileInitial: (formData.name.trim() || formData.email.charAt(0)).charAt(0).toUpperCase(),
        avatar: null,
        isNewUser: !isLogin // Flag to show onboarding for new users
      };
      
      // Update app state first
      onLogin(user);
      
      // Clear form data for security
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        password: '',
        confirmPassword: ''
      });
      
      // Navigate to dashboard after successful authentication
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100); // Small delay to ensure state update completes
      
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Authentication failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLogin, validateForm, onLogin, navigate]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  }, [errors]);

  const handleBackToHome = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const handleToggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setErrors({}); // Clear errors when switching modes
  }, []);

  const handleDemoFill = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      email: 'demo@vendor.com',
      password: 'demo123',
      ...(isLogin ? {} : {
        name: 'Demo User',
        phone: '+91 98765 43210',
        businessName: 'Demo Street Food',
        confirmPassword: 'demo123'
      })
    }));
    setErrors({}); // Clear any existing errors
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          onClick={handleBackToHome}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6 transition-colors duration-300 group"
          aria-label="Back to Home"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              {isLogin ? 'Welcome Back!' : 'Join VendorLink'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your vendor account'}
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {!isLogin && (
              <>
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                      } focus:ring-2 focus:ring-orange-200 transition-all duration-300`}
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1" role="alert">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                        errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                      } focus:ring-2 focus:ring-orange-200 transition-all duration-300`}
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1" role="alert">{errors.phone}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                        errors.businessName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                      } focus:ring-2 focus:ring-orange-200 transition-all duration-300`}
                      disabled={isLoading}
                      autoComplete="organization"
                    />
                  </div>
                  {errors.businessName && <p className="text-red-500 text-sm mt-1" role="alert">{errors.businessName}</p>}
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                  } focus:ring-2 focus:ring-orange-200 transition-all duration-300`}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                  } focus:ring-2 focus:ring-orange-200 transition-all duration-300`}
                  disabled={isLoading}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1" role="alert">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                    } focus:ring-2 focus:ring-orange-200 transition-all duration-300`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1" role="alert">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={handleToggleMode}
                className="ml-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300 focus:outline-none focus:underline"
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo Login for Testing */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">For demo purposes:</p>
            <button
              onClick={handleDemoFill}
              className="w-full text-sm text-orange-500 hover:text-orange-600 transition-colors duration-300 focus:outline-none focus:underline"
              disabled={isLoading}
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};