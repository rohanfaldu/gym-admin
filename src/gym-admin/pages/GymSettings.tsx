import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Mail, 
  MessageSquare,
  Bell,
  Shield,
  Palette,
  Clock,
  MapPin,
  Phone,
  Save
} from 'lucide-react';

interface GymSettings {
  // General Settings
  gymName: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  
  // Language & Localization
  language: 'en' | 'ar';
  timezone: string;
  currency: string;
  
  // Payment Settings
  paymentGateway: string;
  stripeKey: string;
  paypalEmail: string;
  
  // Email Settings
  emailProvider: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  
  // WhatsApp Settings
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappApiKey: string;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Theme Settings
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  
  // Business Hours
  workingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
}

const GymSettings: React.FC = () => {
  const [settings, setSettings] = useState<GymSettings>({
    // General Settings
    gymName: 'FitZone Premium',
    description: 'Premium fitness facility with state-of-the-art equipment',
    address: '123 Fitness Street',
    city: 'New York',
    phone: '+1 (555) 123-4567',
    email: 'info@fitzone.com',
    website: 'https://fitzone.com',
    
    // Language & Localization
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    
    // Payment Settings
    paymentGateway: 'stripe',
    stripeKey: '',
    paypalEmail: '',
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    
    // WhatsApp Settings
    whatsappEnabled: false,
    whatsappNumber: '',
    whatsappApiKey: '',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Theme Settings
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    darkMode: true,
    
    // Business Hours
    workingHours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '08:00', close: '18:00', closed: false }
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'theme', name: 'Theme', icon: Palette },
    { id: 'hours', name: 'Business Hours', icon: Clock }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية (Arabic)' }
  ];

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Dubai',
    'Asia/Tokyo'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR'];

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSettings = (updates: Partial<GymSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateWorkingHours = (day: string, updates: Partial<{ open: string; close: string; closed: boolean }>) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], ...updates }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Gym Settings</h2>
          <p className="text-gray-400">Configure your gym's settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg flex items-center space-x-2 ${
            saved 
              ? 'bg-green-500 text-black shadow-green-500/30' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black shadow-purple-500/30'
          }`}
        >
          <Save className="h-5 w-5" />
          <span>{loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gym Name</label>
                    <input
                      type="text"
                      value={settings.gymName}
                      onChange={(e) => updateSettings({ gymName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSettings({ email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => updateSettings({ website: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => updateSettings({ address: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) => updateSettings({ city: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => updateSettings({ description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Language Settings */}
            {activeTab === 'language' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Language & Localization</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'ar' })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSettings({ timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSettings({ currency: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Payment Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Gateway</label>
                  <select
                    value={settings.paymentGateway}
                    onChange={(e) => updateSettings({ paymentGateway: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                
                {settings.paymentGateway === 'stripe' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stripe Secret Key</label>
                    <input
                      type="password"
                      value={settings.stripeKey}
                      onChange={(e) => updateSettings({ stripeKey: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="sk_test_..."
                    />
                  </div>
                )}
                
                {settings.paymentGateway === 'paypal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">PayPal Email</label>
                    <input
                      type="email"
                      value={settings.paypalEmail}
                      onChange={(e) => updateSettings({ paypalEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Email Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => updateSettings({ smtpHost: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
                    <input
                      type="text"
                      value={settings.smtpPort}
                      onChange={(e) => updateSettings({ smtpPort: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="587"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={settings.smtpUsername}
                      onChange={(e) => updateSettings({ smtpUsername: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => updateSettings({ smtpPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Settings */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">WhatsApp Settings</h3>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.whatsappEnabled}
                      onChange={(e) => updateSettings({ whatsappEnabled: e.target.checked })}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Enable WhatsApp Integration</span>
                  </label>
                </div>
                
                {settings.whatsappEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={settings.whatsappNumber}
                        onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="+1234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                      <input
                        type="password"
                        value={settings.whatsappApiKey}
                        onChange={(e) => updateSettings({ whatsappApiKey: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
                        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">Email Notifications</span>
                    </label>
                    <p className="text-gray-400 text-sm ml-6">Receive notifications via email</p>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => updateSettings({ smsNotifications: e.target.checked })}
                        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">SMS Notifications</span>
                    </label>
                    <p className="text-gray-400 text-sm ml-6">Receive notifications via SMS</p>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => updateSettings({ pushNotifications: e.target.checked })}
                        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">Push Notifications</span>
                    </label>
                    <p className="text-gray-400 text-sm ml-6">Receive browser push notifications</p>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Theme Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-gray-700 bg-gray-800"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-gray-700 bg-gray-800"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Dark Mode</span>
                  </label>
                </div>
              </div>
            )}

            {/* Business Hours */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Business Hours</h3>
                
                <div className="space-y-4">
                  {days.map((day) => (
                    <div key={day.key} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <div className="w-24">
                        <span className="text-white font-medium">{day.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!settings.workingHours[day.key].closed}
                          onChange={(e) => updateWorkingHours(day.key, { closed: !e.target.checked })}
                          className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-300 text-sm">Open</span>
                      </div>
                      
                      {!settings.workingHours[day.key].closed && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <input
                              type="time"
                              value={settings.workingHours[day.key].open}
                              onChange={(e) => updateWorkingHours(day.key, { open: e.target.value })}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          
                          <span className="text-gray-400">to</span>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <input
                              type="time"
                              value={settings.workingHours[day.key].close}
                              onChange={(e) => updateWorkingHours(day.key, { close: e.target.value })}
                              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </>
                      )}
                      
                      {settings.workingHours[day.key].closed && (
                        <span className="text-red-400 text-sm">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymSettings;