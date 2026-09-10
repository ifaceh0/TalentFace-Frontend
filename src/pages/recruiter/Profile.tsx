import { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface FormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  companyName: string;
  designation: string;
  companyWebsite: string;
}

const COUNTRIES: Country[] = [
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: '+43', flag: '🇦🇹' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪' },
  { name: 'Bhutan', code: '+975', flag: '🇧🇹' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'Croatia', code: '+385', flag: '🇭🇷' },
  { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬' },
  { name: 'Finland', code: '+358', flag: '🇫🇮' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'Greece', code: '+30', flag: '🇬🇷' },
  { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
  { name: 'Hungary', code: '+36', flag: '🇭🇺' },
  { name: 'Iceland', code: '+354', flag: '🇮🇸' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'Norway', code: '+47', flag: '🇳🇴' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦' },
  { name: 'Romania', code: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Taiwan', code: '+886', flag: '🇹🇼' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' },
  { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    countryCode: '+91',
    phone: '',
    companyName: '',
    designation: '',
    companyWebsite: '',
  });

  useEffect(() => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const numbersOnly = event.target.value.replace(/\D/g, '');

    if (numbersOnly.length > 10) {
      setPhoneError(
        'Phone number cannot contain more than 10 digits.',
      );
      return;
    }

    setFormData((previousFormData) => ({
      ...previousFormData,
      phone: numbersOnly,
    }));

    if (numbersOnly.length === 0) {
      setPhoneError('');
      return;
    }

    if (numbersOnly.length < 10) {
      const remainingDigits = 10 - numbersOnly.length;

      setPhoneError(
        `Phone number must contain exactly 10 digits. ${remainingDigits} more ${
          remainingDigits === 1 ? 'digit' : 'digits'
        } required.`,
      );
      return;
    }

    setPhoneError('');
  };

  const handleCountryChange = (country: Country): void => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      countryCode: country.code,
    }));
  };

  const handleSave = (): void => {
    if (formData.phone.length !== 10) {
      setPhoneError(
        'Please enter a valid phone number containing exactly 10 digits.',
      );
      return;
    }

    console.log('Saving profile:', formData);

    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setPhoneError('');
  };

  const isPhoneValid = formData.phone.length === 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/recruiter/dashboard')}
            className="flex items-center gap-2 text-blue-900 transition hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">
              Back to Dashboard
            </span>
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg">
          <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-red-600" />

          <div className="relative -mt-16 px-8 py-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-red-500 text-5xl font-bold text-white shadow-lg">
                  {user?.name
                    ?.split(' ')
                    .map((namePart) => namePart.charAt(0))
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) ?? 'U'}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.name ?? 'User'}
                  </h1>

                  <p className="font-medium text-blue-600">
                    Recruiter
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    handleCancel();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Mail size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </p>

                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-700">
                      {formData.email || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Phone size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </p>

                  {isEditing ? (
                    <div className="mt-1">
                      <div className="flex gap-2">
                        <CountryCodeSelector
                          value={formData.countryCode}
                          onChange={handleCountryChange}
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="10-digit number"
                          aria-invalid={phoneError.length > 0}
                          className={`min-w-0 w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 ${
                            phoneError.length > 0
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        />
                      </div>

                      {phoneError.length > 0 && (
                        <p className="mt-2 text-sm text-red-600">
                          {phoneError}
                        </p>
                      )}

                      {isPhoneValid && phoneError.length === 0 && (
                        <p className="mt-2 text-sm text-green-600">
                          Phone number is valid.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 font-medium text-gray-700">
                      {formData.phone.length > 0
                        ? `${formData.countryCode} ${formData.phone}`
                        : 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Building size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Company
                  </p>

                  {isEditing ? (
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-700">
                      {formData.companyName || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Designation */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <User size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Designation
                  </p>

                  {isEditing ? (
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Enter your designation"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-700">
                      {formData.designation || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Globe size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Website
                  </p>

                  {isEditing ? (
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ) : (
                    <p className="mt-1 font-medium text-gray-700">
                      {formData.companyWebsite ? (
                        <a
                          href={formData.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
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

            {isEditing && (
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isPhoneValid}
                  className={`flex-1 rounded-lg px-6 py-3 font-semibold text-white transition ${
                    isPhoneValid
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'cursor-not-allowed bg-gray-400'
                  }`}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Account Status
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Account Type</span>

              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Recruiter
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Member Since</span>

              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Account Status</span>

              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CountryCodeSelectorProps {
  value: string;
  onChange: (country: Country) => void;
}

function CountryCodeSelector({
  value,
  onChange,
}: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectorRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRIES.find((country) => country.code === value) ??
    COUNTRIES.find((country) => country.name === 'India') ??
    COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter((country) => {
    const searchTerm = search.toLowerCase().trim();

    return (
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.includes(searchTerm)
    );
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div
      ref={selectorRef}
      className="relative w-40 flex-shrink-0"
    >
      <button
        type="button"
        onClick={() => setIsOpen((previousState) => !previousState)}
        className="flex h-[42px] w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-sm transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">
            {selectedCountry.flag}
          </span>

          <span className="font-medium text-gray-700">
            {selectedCountry.code}
          </span>
        </span>

        <span
          className={`text-xs text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                autoFocus
                placeholder="Search country or code"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div
            className="max-h-64 overflow-y-auto p-1"
            role="listbox"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={`${country.name}-${country.code}`}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-blue-50 ${
                    selectedCountry.name === country.name
                      ? 'bg-blue-50'
                      : ''
                  }`}
                  role="option"
                  aria-selected={
                    selectedCountry.name === country.name
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">
                      {country.flag}
                    </span>

                    <span className="text-sm text-gray-700">
                      {country.name}
                    </span>
                  </span>

                  <span className="text-sm font-semibold text-gray-500">
                    {country.code}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No country found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// import { useEffect, useRef, useState } from 'react';
// import {
//   User,
//   Mail,
//   Phone,
//   Building,
//   Globe,
//   ArrowLeft,
// } from 'lucide-react';
// import { useAuth } from '../../context/useAuth';
// import { useNavigate } from 'react-router-dom';

// interface Country {
//   name: string;
//   code: string;
//   flag: string;
// }

// interface FormData {
//   name: string;
//   email: string;
//   countryCode: string;
//   phone: string;
//   companyName: string;
//   designation: string;
//   companyWebsite: string;
// }

// const COUNTRIES: Country[] = [
//   { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
//   { name: 'Albania', code: '+355', flag: '🇦🇱' },
//   { name: 'Algeria', code: '+213', flag: '🇩🇿' },
//   { name: 'Argentina', code: '+54', flag: '🇦🇷' },
//   { name: 'Australia', code: '+61', flag: '🇦🇺' },
//   { name: 'Austria', code: '+43', flag: '🇦🇹' },
//   { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
//   { name: 'Belgium', code: '+32', flag: '🇧🇪' },
//   { name: 'Bhutan', code: '+975', flag: '🇧🇹' },
//   { name: 'Brazil', code: '+55', flag: '🇧🇷' },
//   { name: 'Canada', code: '+1', flag: '🇨🇦' },
//   { name: 'China', code: '+86', flag: '🇨🇳' },
//   { name: 'Colombia', code: '+57', flag: '🇨🇴' },
//   { name: 'Croatia', code: '+385', flag: '🇭🇷' },
//   { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
//   { name: 'Denmark', code: '+45', flag: '🇩🇰' },
//   { name: 'Egypt', code: '+20', flag: '🇪🇬' },
//   { name: 'Finland', code: '+358', flag: '🇫🇮' },
//   { name: 'France', code: '+33', flag: '🇫🇷' },
//   { name: 'Germany', code: '+49', flag: '🇩🇪' },
//   { name: 'Greece', code: '+30', flag: '🇬🇷' },
//   { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
//   { name: 'Hungary', code: '+36', flag: '🇭🇺' },
//   { name: 'Iceland', code: '+354', flag: '🇮🇸' },
//   { name: 'India', code: '+91', flag: '🇮🇳' },
//   { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
//   { name: 'Ireland', code: '+353', flag: '🇮🇪' },
//   { name: 'Israel', code: '+972', flag: '🇮🇱' },
//   { name: 'Italy', code: '+39', flag: '🇮🇹' },
//   { name: 'Japan', code: '+81', flag: '🇯🇵' },
//   { name: 'Kenya', code: '+254', flag: '🇰🇪' },
//   { name: 'Kuwait', code: '+965', flag: '🇰🇼' },
//   { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
//   { name: 'Mexico', code: '+52', flag: '🇲🇽' },
//   { name: 'Nepal', code: '+977', flag: '🇳🇵' },
//   { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
//   { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
//   { name: 'Norway', code: '+47', flag: '🇳🇴' },
//   { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
//   { name: 'Philippines', code: '+63', flag: '🇵🇭' },
//   { name: 'Poland', code: '+48', flag: '🇵🇱' },
//   { name: 'Portugal', code: '+351', flag: '🇵🇹' },
//   { name: 'Qatar', code: '+974', flag: '🇶🇦' },
//   { name: 'Romania', code: '+40', flag: '🇷🇴' },
//   { name: 'Russia', code: '+7', flag: '🇷🇺' },
//   { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
//   { name: 'Singapore', code: '+65', flag: '🇸🇬' },
//   { name: 'South Africa', code: '+27', flag: '🇿🇦' },
//   { name: 'South Korea', code: '+82', flag: '🇰🇷' },
//   { name: 'Spain', code: '+34', flag: '🇪🇸' },
//   { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
//   { name: 'Sweden', code: '+46', flag: '🇸🇪' },
//   { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
//   { name: 'Taiwan', code: '+886', flag: '🇹🇼' },
//   { name: 'Thailand', code: '+66', flag: '🇹🇭' },
//   { name: 'Turkey', code: '+90', flag: '🇹🇷' },
//   { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
//   { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
//   { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
//   { name: 'United States', code: '+1', flag: '🇺🇸' },
//   { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
// ];

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [isEditing, setIsEditing] = useState(false);
//   const [phoneError, setPhoneError] = useState('');

//   const [formData, setFormData] = useState<FormData>({
//     name: user?.name ?? '',
//     email: user?.email ?? '',
//     countryCode: '+91',
//     phone: '',
//     companyName: '',
//     designation: '',
//     companyWebsite: '',
//   });

//   useEffect(() => {
//     setFormData((previousFormData) => ({
//       ...previousFormData,
//       name: user?.name ?? '',
//       email: user?.email ?? '',
//     }));
//   }, [user]);

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ): void => {
//     const { name, value } = event.target;

//     setFormData((previousFormData) => ({
//       ...previousFormData,
//       [name]: value,
//     }));
//   };

//   const handlePhoneChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ): void => {
//     const numbersOnly = event.target.value.replace(/\D/g, '');

//     if (numbersOnly.length > 10) {
//       setPhoneError(
//         'Phone number cannot contain more than 10 digits.',
//       );
//       return;
//     }

//     setFormData((previousFormData) => ({
//       ...previousFormData,
//       phone: numbersOnly,
//     }));

//     if (numbersOnly.length === 0) {
//       setPhoneError('');
//       return;
//     }

//     if (numbersOnly.length < 10) {
//       const remainingDigits = 10 - numbersOnly.length;

//       setPhoneError(
//         `Phone number must contain exactly 10 digits. ${remainingDigits} more ${
//           remainingDigits === 1 ? 'digit' : 'digits'
//         } required.`,
//       );
//       return;
//     }

//     setPhoneError('');
//   };

//   const handleCountryChange = (country: Country): void => {
//     setFormData((previousFormData) => ({
//       ...previousFormData,
//       countryCode: country.code,
//     }));
//   };

//   const handleSave = (): void => {
//     if (formData.phone.length !== 10) {
//       setPhoneError(
//         'Please enter a valid phone number containing exactly 10 digits.',
//       );
//       return;
//     }

//     console.log('Saving profile:', formData);

//     setIsEditing(false);
//   };

//   const handleCancel = (): void => {
//     setIsEditing(false);
//     setPhoneError('');
//   };

//   const isPhoneValid = formData.phone.length === 10;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-8">
//       <div className="mx-auto max-w-2xl">
//         <div className="mb-8 flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => navigate('/recruiter/dashboard')}
//             className="flex items-center gap-2 text-blue-900 transition hover:text-blue-700"
//           >
//             <ArrowLeft size={20} />
//             <span className="text-sm font-medium">
//               Back to Dashboard
//             </span>
//           </button>
//         </div>

//         <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg">
//           <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-red-600" />

//           <div className="relative -mt-16 px-8 py-6">
//             <div className="mb-6 flex items-end justify-between gap-4">
//               <div className="flex items-end gap-4">
//                 <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-red-500 text-5xl font-bold text-white shadow-lg">
//                   {user?.name
//                     ?.split(' ')
//                     .map((namePart) => namePart.charAt(0))
//                     .join('')
//                     .toUpperCase()
//                     .slice(0, 2) ?? 'U'}
//                 </div>

//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">
//                     {user?.name ?? 'User'}
//                   </h1>

//                   <p className="font-medium text-blue-600">
//                     Recruiter
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   if (isEditing) {
//                     handleCancel();
//                   } else {
//                     setIsEditing(true);
//                   }
//                 }}
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 {isEditing ? 'Cancel' : 'Edit Profile'}
//               </button>
//             </div>

//             <div className="mt-8 space-y-6">
//               {/* Email */}
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                   <Mail size={20} />
//                 </div>

//                 <div className="flex-1">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Email
//                   </p>

//                   {isEditing ? (
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       disabled
//                       className="mt-1 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
//                     />
//                   ) : (
//                     <p className="mt-1 font-medium text-gray-700">
//                       {formData.email || 'Not provided'}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                   <Phone size={20} />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Phone
//                   </p>

//                   {isEditing ? (
//                     <div className="mt-1">
//                       <div className="flex gap-2">
//                         <CountryCodeSelector
//                           value={formData.countryCode}
//                           onChange={handleCountryChange}
//                         />

//                         <input
//                           type="tel"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handlePhoneChange}
//                           inputMode="numeric"
//                           maxLength={10}
//                           placeholder="10-digit number"
//                           aria-invalid={phoneError.length > 0}
//                           className={`min-w-0 w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 ${
//                             phoneError.length > 0
//                               ? 'border-red-500 focus:ring-red-200'
//                               : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
//                           }`}
//                         />
//                       </div>

//                       {phoneError.length > 0 && (
//                         <p className="mt-2 text-sm text-red-600">
//                           {phoneError}
//                         </p>
//                       )}

//                       {isPhoneValid && phoneError.length === 0 && (
//                         <p className="mt-2 text-sm text-green-600">
//                           Phone number is valid.
//                         </p>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="mt-1 font-medium text-gray-700">
//                       {formData.phone.length > 0
//                         ? `${formData.countryCode} ${formData.phone}`
//                         : 'Not provided'}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Company */}
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                   <Building size={20} />
//                 </div>

//                 <div className="flex-1">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Company
//                   </p>

//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="companyName"
//                       value={formData.companyName}
//                       onChange={handleInputChange}
//                       placeholder="Enter company name"
//                       className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                     />
//                   ) : (
//                     <p className="mt-1 font-medium text-gray-700">
//                       {formData.companyName || 'Not provided'}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Designation */}
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                   <User size={20} />
//                 </div>

//                 <div className="flex-1">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Designation
//                   </p>

//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="designation"
//                       value={formData.designation}
//                       onChange={handleInputChange}
//                       placeholder="Enter your designation"
//                       className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                     />
//                   ) : (
//                     <p className="mt-1 font-medium text-gray-700">
//                       {formData.designation || 'Not provided'}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Website */}
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                   <Globe size={20} />
//                 </div>

//                 <div className="flex-1">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Website
//                   </p>

//                   {isEditing ? (
//                     <input
//                       type="url"
//                       name="companyWebsite"
//                       value={formData.companyWebsite}
//                       onChange={handleInputChange}
//                       placeholder="https://example.com"
//                       className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                     />
//                   ) : (
//                     <p className="mt-1 font-medium text-gray-700">
//                       {formData.companyWebsite ? (
//                         <a
//                           href={formData.companyWebsite}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           {formData.companyWebsite}
//                         </a>
//                       ) : (
//                         'Not provided'
//                       )}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {isEditing && (
//               <div className="mt-8 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   disabled={!isPhoneValid}
//                   className={`flex-1 rounded-lg px-6 py-3 font-semibold text-white transition ${
//                     isPhoneValid
//                       ? 'bg-blue-600 hover:bg-blue-700'
//                       : 'cursor-not-allowed bg-gray-400'
//                   }`}
//                 >
//                   Save Changes
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Account Status */}
//         <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
//           <h3 className="mb-3 text-lg font-semibold text-gray-900">
//             Account Status
//           </h3>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-700">Account Type</span>

//               <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
//                 Recruiter
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-gray-700">Member Since</span>

//               <span className="font-medium text-gray-900">
//                 {new Date().toLocaleDateString('en-IN', {
//                   year: 'numeric',
//                   month: 'long',
//                 })}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-gray-700">Account Status</span>

//               <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//                 Active
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// interface CountryCodeSelectorProps {
//   value: string;
//   onChange: (country: Country) => void;
// }

// function CountryCodeSelector({
//   value,
//   onChange,
// }: CountryCodeSelectorProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState('');

//   const selectorRef = useRef<HTMLDivElement>(null);

//   const selectedCountry =
//     COUNTRIES.find((country) => country.code === value) ??
//     COUNTRIES.find((country) => country.name === 'India') ??
//     COUNTRIES[0];

//   const filteredCountries = COUNTRIES.filter((country) => {
//     const searchTerm = search.toLowerCase().trim();

//     return (
//       country.name.toLowerCase().includes(searchTerm) ||
//       country.code.includes(searchTerm)
//     );
//   });

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent): void => {
//       if (
//         selectorRef.current &&
//         !selectorRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//         setSearch('');
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside,
//       );
//     };
//   }, []);

//   return (
//     <div
//       ref={selectorRef}
//       className="relative w-40 flex-shrink-0"
//     >
//       <button
//         type="button"
//         onClick={() => setIsOpen((previousState) => !previousState)}
//         className="flex h-[42px] w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-sm transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
//         aria-haspopup="listbox"
//         aria-expanded={isOpen}
//       >
//         <span className="flex items-center gap-2">
//           <span className="text-xl">
//             {selectedCountry.flag}
//           </span>

//           <span className="font-medium text-gray-700">
//             {selectedCountry.code}
//           </span>
//         </span>

//         <span
//           className={`text-xs text-gray-500 transition-transform ${
//             isOpen ? 'rotate-180' : ''
//           }`}
//         >
//           ▼
//         </span>
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
//           <div className="border-b border-gray-100 p-3">
//             <div className="relative">
//               <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 🔍
//               </span>

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 autoFocus
//                 placeholder="Search country or code"
//                 className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//               />
//             </div>
//           </div>

//           <div
//             className="max-h-64 overflow-y-auto p-1"
//             role="listbox"
//           >
//             {filteredCountries.length > 0 ? (
//               filteredCountries.map((country) => (
//                 <button
//                   key={`${country.name}-${country.code}`}
//                   type="button"
//                   onClick={() => {
//                     onChange(country);
//                     setIsOpen(false);
//                     setSearch('');
//                   }}
//                   className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-blue-50 ${
//                     selectedCountry.name === country.name
//                       ? 'bg-blue-50'
//                       : ''
//                   }`}
//                   role="option"
//                   aria-selected={
//                     selectedCountry.name === country.name
//                   }
//                 >
//                   <span className="flex items-center gap-3">
//                     <span className="text-xl">
//                       {country.flag}
//                     </span>

//                     <span className="text-sm text-gray-700">
//                       {country.name}
//                     </span>
//                   </span>

//                   <span className="text-sm font-semibold text-gray-500">
//                     {country.code}
//                   </span>
//                 </button>
//               ))
//             ) : (
//               <p className="px-4 py-6 text-center text-sm text-gray-500">
//                 No country found.
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }