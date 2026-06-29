import { useState } from 'react';
import { Bell, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: 'private',
    twoFactorAuth: false,
  });

  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Success Message */}
        {showSavedMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="text-sm font-medium text-green-700">Settings saved successfully!</p>
          </div>
        )}

        {/* Settings Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account preferences and notifications</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Bell size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500 mt-1">Receive updates about new applications and job postings</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500 mt-1">Get real-time notifications on your device</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500 mt-1">Receive tips, updates, and promotional content</p>
                </div>
                <button
                  onClick={() => handleToggle('marketingEmails')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.marketingEmails ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
            </div>

            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <p className="font-semibold text-gray-900 mb-3">Profile Visibility</p>
                <div className="space-y-3">
                  {['private', 'recruiters', 'public'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option}
                        checked={settings.profileVisibility === option}
                        onChange={(e) => setSettings((prev) => ({ ...prev, profileVisibility: e.target.value }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">{option === 'recruiters' ? 'Visible to Recruiters Only' : `${option.charAt(0).toUpperCase() + option.slice(1)}`}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>

            <div className="space-y-4">
              {/* Two Factor Auth */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => handleToggle('twoFactorAuth')}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition transform ${
                      settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Change Password Link */}
              <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500 mt-1">Update your account password regularly</p>
                  </div>
                  <button
                    onClick={() => navigate('/recruiter/change-password')}
                    className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-900 mb-4">Account Deletion</h2>
            <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              Delete Account
            </button>
            <p className="text-xs text-red-600 mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Save Settings
          </button>
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}