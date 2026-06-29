import { useState } from 'react';
import { User, Mail, Phone, Building, Globe, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    companyName: '',
    designation: '',
    companyWebsite: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // API call would go here
    console.log('Saving profile:', formData);
    setIsEditing(false);
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

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-red-600"></div>

          {/* Profile Content */}
          <div className="px-8 py-6 -mt-16 relative">
            {/* Avatar */}
            <div className="flex items-end justify-between mb-6">
              <div className="flex items-end gap-4">
                <div className="w-28 h-28 rounded-2xl bg-red-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                  <p className="text-blue-600 font-medium">Recruiter</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Information */}
            <div className="space-y-6 mt-8">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="mt-1 text-gray-700 bg-gray-100 px-3 py-2 rounded-lg w-full text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 font-medium">{formData.email || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="mt-1 text-gray-700 px-3 py-2 rounded-lg w-full text-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 font-medium">{formData.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Building size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      className="mt-1 text-gray-700 px-3 py-2 rounded-lg w-full text-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 font-medium">{formData.companyName || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Designation */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Designation</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Enter your designation"
                      className="mt-1 text-gray-700 px-3 py-2 rounded-lg w-full text-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 font-medium">{formData.designation || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Company Website */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Globe size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</p>
                  {isEditing ? (
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="mt-1 text-gray-700 px-3 py-2 rounded-lg w-full text-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 font-medium">
                      {formData.companyWebsite ? (
                        <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {formData.companyWebsite}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Account Type</span>
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">Recruiter</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Member Since</span>
              <span className="text-gray-900 font-medium">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Account Status</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}