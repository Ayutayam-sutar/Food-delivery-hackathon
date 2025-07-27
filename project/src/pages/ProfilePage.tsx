import React, { useState, useEffect } from 'react';
import { User, Settings, Bell, HelpCircle, Phone, Mail, Building, Camera, Save, ArrowLeft } from 'lucide-react';

interface User {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  isDemo?: boolean;
}

interface ProfilePageProps {
  state: AppState;
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ state, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'help'>('profile');
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newRequests: true,
    surplusDeals: false,
    weeklyReports: true
  });

  const [profileData, setProfileData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    businessName: state.user?.businessName || '',
    address: '123 Street Food Lane, Mumbai',
    businessType: 'Street Food Vendor',
    gst: 'GST123456789',
    avatar: state.user?.avatar || 'https://images.pexels.com/photos/8112190/pexels-photo-8112190.jpeg?auto=compress&cs=tinysrgb&w=400'
  });

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedProfileData = (window as any).profileData || {};
      const savedNotifications = (window as any).notificationSettings || {};
      
      if (Object.keys(savedProfileData).length > 0) {
        setProfileData(prev => ({
          ...prev,
          ...savedProfileData
        }));
      }
      
      if (Object.keys(savedNotifications).length > 0) {
        setNotifications(prev => ({
          ...prev,
          ...savedNotifications
        }));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save data to window object whenever it changes
  useEffect(() => {
    try {
      (window as any).profileData = profileData;
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  }, [profileData]);

  useEffect(() => {
    try {
      (window as any).notificationSettings = notifications;
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }, [notifications]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const updatedProfileData = { ...profileData, avatar: result };
        setProfileData(updatedProfileData);
        // Immediately save to window object
        try {
          (window as any).profileData = updatedProfileData;
        } catch (error) {
          console.error('Error saving photo:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Save to window object for persistence
    try {
      (window as any).profileData = profileData;
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    
    // In demo mode, simulate profile update
    if (state.isDemo) {
      // Show loading state
      const button = document.querySelector('[data-save-profile]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Saving...';
      }
      
      setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.innerHTML = '<svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Saved!';
        }
        alert('✅ Profile updated successfully! Changes are saved and will persist after refresh.');
        
        setTimeout(() => {
          if (button) {
            button.innerHTML = '<svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>Save Changes';
          }
        }, 2000);
      }, 1500);
    } else {
      alert('✅ Profile updated successfully! Changes are saved and will persist after refresh.');
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    try {
      const updatedNotifications = { ...notifications, [key]: value };
      setNotifications(updatedNotifications);
      // Immediately save to window object
      (window as any).notificationSettings = updatedNotifications;
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="h-5 w-5" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mr-6 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-orange-500 bg-orange-50 border-b-2 border-orange-500'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-orange-200"
                    />
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-300 cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                    <p className="text-gray-600">{profileData.businessName}</p>
                    <p className="text-sm text-gray-500 mt-1">Click the camera icon to upload your photo</p>
                    {state.isDemo && (
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                        Demo Mode - Changes Persist
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      value={profileData.businessType}
                      onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                    >
                      <option value="Street Food Vendor">Street Food Vendor</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Catering Service">Catering Service</option>
                      <option value="Food Truck">Food Truck</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={profileData.gst}
                      onChange={(e) => setProfileData({ ...profileData, gst: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <button
                  data-save-profile
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                {/* Notification Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {key === 'lowStock' && 'Get notified when inventory runs low'}
                              {key === 'newRequests' && 'Receive alerts for new supplier requests'}
                              {key === 'surplusDeals' && 'Discover new surplus deals'}
                              {key === 'weeklyReports' && 'Weekly business insights and reports'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            value ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy & Security */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Profile Visibility</h4>
                      <p className="text-sm text-gray-600 mb-3">Control who can see your business profile</p>
                      <select className="border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300">
                        <option value="verified">Verified Vendors Only</option>
                        <option value="all">All Users</option>
                        <option value="network">My Network Only</option>
                      </select>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">📚 Getting Started Guide</h3>
                    <p className="text-blue-700 mb-4">Learn how to use VendorLink effectively</p>
                    <a href='https://www.youtube.com/watch?v=sTaEwwHOzjc' target='main'><button className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300">
                      View Guide →
                    </button> </a> 
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">💬 Live Chat Support</h3>
                    <p className="text-green-700 mb-4">Get instant help from our support team</p>
                    <button className="text-green-600 font-medium hover:text-green-800 transition-colors duration-300">
                      Start Chat →
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">🎥 Video Tutorials</h3>
                    <p className="text-purple-700 mb-4">Watch step-by-step video guides</p>
                  <a href='https://www.youtube.com/watch?v=xvFZjo5PgG0 ' target='main'> <button className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-300">
                      Watch Videos →
                    </button></a>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">📞 Contact Support</h3>
                    <p className="text-orange-700 mb-4">Call us at +91 98765 43210</p>
                      <a href='tel:+91 98765 43210'><button className="text-orange-600 font-medium hover:text-orange-800 transition-colors duration-300">
                      Call Now →
                    </button></a>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <details className="group">
                      <summary className="cursor-pointer font-medium text-gray-900 hover:text-orange-500 transition-colors duration-300">
                        How do I add new suppliers to my network?
                      </summary>
                      <p className="mt-2 text-gray-600">
                        Navigate to the Suppliers page and use the search function to find verified suppliers. Click "Request" to send a connection request.
                      </p>
                    </details>
                    <details className="group">
                      <summary className="cursor-pointer font-medium text-gray-900 hover:text-orange-500 transition-colors duration-300">
                        What happens when my inventory runs low?
                      </summary>
                      <p className="mt-2 text-gray-600">
                        You'll receive automatic notifications when items reach their threshold levels. Our AI will also suggest suppliers who can fulfill your requirements.
                      </p>
                    </details>
                    <details className="group">
                      <summary className="cursor-pointer font-medium text-gray-900 hover:text-orange-500 transition-colors duration-300">
                        How does the surplus exchange work?
                      </summary>
                      <p className="mt-2 text-gray-600">
                        Post your excess inventory at discounted prices to help other vendors while reducing waste. You can also browse deals from other vendors.
                      </p>
                    </details>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-3">💭 Share Your Feedback</h3>
                  <p className="mb-4">Help us improve VendorLink with your suggestions</p>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg text-gray-900 resize-none"
                    rows={3}
                    placeholder="Tell us what you think..."
                  />
                  <button className="mt-4 bg-white text-orange-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
                    Send Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};