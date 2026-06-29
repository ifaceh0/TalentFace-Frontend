import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import FormField from '../ui/FormField';
import { updateBasicDetails } from '../../services/joinee.service';
import type { JoineeProfile } from '../../types/joinee.types';

interface BasicDetailsFormProps {
  profile: JoineeProfile;
  onUpdate: (updated: JoineeProfile) => void;
}

export default function BasicDetailsForm({ profile, onUpdate }: BasicDetailsFormProps) {
  const [form, setForm] = useState({
    name:           profile.name           ?? '',
    phone:          profile.phone          ?? '',
    dateOfBirth:    profile.dateOfBirth    ? profile.dateOfBirth.slice(0, 10) : '',
    gender:         profile.gender         ?? '',
    currentCollege: profile.currentCollege ?? '',
    department:     profile.department     ?? '',
    course:         profile.course         ?? '',
    experience:     profile.experience     ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    if (form.phone && !isValidPhoneNumber(form.phone)) {
  setMsg({ type: 'error', text: 'Please enter a valid phone number.' });
  setLoading(false);
  return;
}
    try {
      const updated = await updateBasicDetails({
        ...form,
        gender: form.gender as JoineeProfile['gender'],
        experience: Number(form.experience),
      });
      onUpdate(updated);
      setMsg({ type: 'success', text: 'Basic details updated successfully!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Basic Details</h2>
        <p className="text-sm text-gray-500 mt-1">Update your personal and academic information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            required
            value={form.name}
            onChange={(e) => handleChange('name', (e.target as HTMLInputElement).value)}
            placeholder="John Doe"
          />
          {/* <FormField
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', (e.target as HTMLInputElement).value)}
            placeholder="+91 98765 43210"
          /> */}
          <div className="flex flex-col gap-1">
  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
  <PhoneInput
    international
    defaultCountry="IN"
    value={form.phone}
    onChange={(val) => {
      handleChange('phone', val ?? '');
      if (val && !isValidPhoneNumber(val)) {
        setPhoneError('Invalid phone number for selected country');
      } else {
        setPhoneError('');
      }
    }}
    className="phone-input-wrapper"
  />
  {phoneError && (
    <p className="text-xs text-red-500 mt-1">{phoneError}</p>
  )}
</div>
          <FormField
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', (e.target as HTMLInputElement).value)}
          />
          <FormField
            as="select"
            label="Gender"
            value={form.gender}
            onChange={(e) => handleChange('gender', (e.target as HTMLSelectElement).value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </FormField>
          <FormField
            label="Current College"
            value={form.currentCollege}
            onChange={(e) => handleChange('currentCollege', (e.target as HTMLInputElement).value)}
            placeholder="XYZ University"
          />
          <FormField
            label="Department"
            value={form.department}
            onChange={(e) => handleChange('department', (e.target as HTMLInputElement).value)}
            placeholder="Computer Science"
          />
          <FormField
            label="Course"
            value={form.course}
            onChange={(e) => handleChange('course', (e.target as HTMLInputElement).value)}
            placeholder="B.Tech / MCA / MBA"
          />
          <FormField
            label="Experience (years)"
            type="number"
            value={String(form.experience)}
            onChange={(e) => handleChange('experience', Number((e.target as HTMLInputElement).value))}
            placeholder="0"
            hint="Total years of work/internship experience"
          />
        </div>

        {msg && (
          <div className={`text-sm px-4 py-3 rounded-xl ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
