import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Palette,
  Save
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const PlatformSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    platformName: 'GymSAAS',
    platformUrl: 'https://gymsaas.com',
    supportEmail: 'support@gymsaas.com',
    maxGymsPerAdmin: 5,
    defaultMembershipDuration: 30,
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    maintenanceMode: false,
    allowGymRegistration: true,
    requireGymApproval: true,
    defaultCommissionRate: 5,
    stripePublishableKey: '',
    stripeSecretKey: '',
    emailProvider: 'sendgrid',
    emailApiKey: '',
    smsProvider: 'twilio',
    smsApiKey: '',
    primaryColor: '#2563EB',
    secondaryColor: '#0891B2',
    accentColor: '#EA580C'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure global platform settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} loading={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform URL
              </label>
              <input
                type="url"
                name="platformUrl"
                value={settings.platformUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Gyms per Admin
                </label>
                <input
                  type="number"
                  name="maxGymsPerAdmin"
                  value={settings.maxGymsPerAdmin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Membership (days)
                </label>
                <input
                  type="number"
                  name="defaultMembershipDuration"
                  value={settings.defaultMembershipDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Business Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Business Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Commission Rate (%)
              </label>
              <input
                type="number"
                name="defaultCommissionRate"
                value={settings.defaultCommissionRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Allow Gym Registration
                </label>
                <input
                  type="checkbox"
                  name="allowGymRegistration"
                  checked={settings.allowGymRegistration}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Require Gym Approval
                </label>
                <input
                  type="checkbox"
                  name="requireGymApproval"
                  checked={settings.requireGymApproval}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </label>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                name="stripePublishableKey"
                value={settings.stripePublishableKey}
                onChange={handleChange}
                placeholder="pk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                name="stripeSecretKey"
                value={settings.stripeSecretKey}
                onChange={handleChange}
                placeholder="sk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Provider
              </label>
              <select
                name="emailProvider"
                value={settings.emailProvider}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="ses">Amazon SES</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email API Key
              </label>
              <input
                type="password"
                name="emailApiKey"
                value={settings.emailApiKey}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Enable Email Notifications
                </label>
                <input
                  type="checkbox"
                  name="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Enable SMS Notifications
                </label>
                <input
                  type="checkbox"
                  name="enableSmsNotifications"
                  checked={settings.enableSmsNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Theme Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  name="secondaryColor"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="accentColor"
                  value={settings.accentColor}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={handleChange}
                  name="accentColor"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">
                  Security settings are managed through environment variables
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                JWT secrets, database credentials, and API keys should be configured in your server environment.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
                <span className="text-sm text-gray-500">Coming Soon</span>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <span className="text-sm text-gray-500">480</span>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password Policy
                </label>
                <span className="text-sm text-gray-500">Minimum 6 characters</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Database</h3>
            <p className="text-sm text-green-600">Connected</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Payment Gateway</h3>
            <p className="text-sm text-green-600">Active</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Email Service</h3>
            <p className="text-sm text-green-600">Operational</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlatformSettings;