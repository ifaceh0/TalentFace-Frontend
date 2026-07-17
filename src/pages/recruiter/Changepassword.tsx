import { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePasswords = () => {
    const newErrors: string[] = [];

    if (!passwords.currentPassword) {
      newErrors.push('Current password is required');
    }

    if (!passwords.newPassword) {
      newErrors.push('New password is required');
    }

    if (passwords.newPassword.length < 8) {
      newErrors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(passwords.newPassword)) {
      newErrors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(passwords.newPassword)) {
      newErrors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(passwords.newPassword)) {
      newErrors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(passwords.newPassword)) {
      newErrors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    if (passwords.currentPassword === passwords.newPassword) {
      newErrors.push('New password must be different from current password');
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    setSuccess(false);
    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Changing password...');
      setSuccess(true);
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
      setTimeout(() => {
        navigate('/recruiter/dashboard');
      }, 2000);
    }, 1500);
  };

  const getPasswordStrength = () => {
    let strength = 0;
    if (passwords.newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(passwords.newPassword)) strength++;
    if (/[a-z]/.test(passwords.newPassword)) strength++;
    if (/[0-9]/.test(passwords.newPassword)) strength++;
    if (/[!@#$%^&*]/.test(passwords.newPassword)) strength++;

    if (strength === 0) return { level: 'Weak', color: 'bg-red-500' };
    if (strength <= 2) return { level: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 3) return { level: 'Good', color: 'bg-blue-500' };
    return { level: 'Strong', color: 'bg-green-500' };
  };

  const strengthIndicator = getPasswordStrength();

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

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
          <p className="text-gray-500 mt-2">Update your account password to keep your account secure</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Password changed successfully!</p>
              <p className="text-sm text-green-700 mt-1">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 mb-2">Please fix the following:</p>
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                New Password
              </label>
              <div className="relative mb-3">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwords.newPassword && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthIndicator.color} transition-all`}
                      style={{
                        width: `${(getPasswordStrength().level.length / 6) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className={`text-xs font-semibold ${
                    strengthIndicator.level === 'Weak' ? 'text-red-600' :
                    strengthIndicator.level === 'Fair' ? 'text-yellow-600' :
                    strengthIndicator.level === 'Good' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {strengthIndicator.level}
                  </span>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-600">Password must contain:</p>
                <div className="grid grid-cols-2 gap-2">
                  <RequirementCheck
                    met={passwords.newPassword.length >= 8}
                    text="At least 8 characters"
                  />
                  <RequirementCheck
                    met={/[A-Z]/.test(passwords.newPassword)}
                    text="Uppercase letter"
                  />
                  <RequirementCheck
                    met={/[a-z]/.test(passwords.newPassword)}
                    text="Lowercase letter"
                  />
                  <RequirementCheck
                    met={/[0-9]/.test(passwords.newPassword)}
                    text="Number"
                  />
                  <RequirementCheck
                    met={/[!@#$%^&*]/.test(passwords.newPassword)}
                    text="Special character"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter your new password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwords.newPassword && passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword && (
                <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={14} />
                  Passwords match
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Change Password
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/recruiter/dashboard')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Password Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Password Security Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Use a unique password that you don't use for other accounts</li>
            <li>• Avoid using personal information like your name or birthdate</li>
            <li>• Don't use the same password twice or recently used passwords</li>
            <li>• Enable two-factor authentication for additional security</li>
            <li>• Change your password regularly (at least every 3 months)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Password Requirements
function RequirementCheck({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs p-2 rounded ${
      met ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
    }`}>
      <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
        met ? 'bg-green-500 border-green-500' : 'border-gray-300'
      }`}>
        {met && <span className="text-white text-xs">✓</span>}
      </div>
      <span>{text}</span>
    </div>
  );
}