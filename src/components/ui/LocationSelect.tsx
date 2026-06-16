import { useEffect, useRef, useState } from 'react';

const FALLBACK_LOCATIONS = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Côte d’Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Remote',
];

const LOCATIONS = (() => {
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function' && typeof Intl.DisplayNames === 'function') {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      const regions = (Intl as any).supportedValuesOf?.('region') as string[] | undefined;
      return ['Remote',
        ...(regions ?? [])
          .filter((code) => code.length === 2)
          .map((code) => regionNames.of(code) ?? code)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      ];
    } catch {
      return FALLBACK_LOCATIONS;
    }
  }
  return FALLBACK_LOCATIONS;
})();

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function LocationSelect({ value, onChange, placeholder = 'Search location...', label }: LocationSelectProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setApiError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setApiError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=8&q=${encodeURIComponent(query.trim())}`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Location service error');
        }

        const results = await response.json();
        const locationNames = Array.isArray(results)
          ? results.map((item: any) => item.display_name).filter(Boolean)
          : [];

        if (locationNames.length > 0) {
          setSuggestions(locationNames);
        } else {
          setSuggestions(
            LOCATIONS.filter((location) =>
              location.toLowerCase().includes(query.trim().toLowerCase())
            ).slice(0, 8)
          );
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setApiError('Unable to load location suggestions');
          setSuggestions(
            LOCATIONS.filter((location) =>
              location.toLowerCase().includes(query.trim().toLowerCase())
            ).slice(0, 8)
          );
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const filteredLocations = query.trim()
    ? suggestions.length > 0
      ? suggestions
      : LOCATIONS.filter((location) =>
          location.toLowerCase().includes(query.trim().toLowerCase())
        ).slice(0, 8)
    : [];

  const handleInputChange = (nextValue: string) => {
    setQuery(nextValue);

    const exactMatch = LOCATIONS.find(
      (location) => location.toLowerCase() === nextValue.trim().toLowerCase()
    );

    if (exactMatch) {
      onChange(exactMatch);
    }
  };

  const handleSelect = (location: string) => {
    setQuery(location);
    onChange(location);
    setIsOpen(false);
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      const exactMatch = filteredLocations.find(
        (location) => location.toLowerCase() === query.trim().toLowerCase()
      );
      if (!exactMatch) {
        setQuery(value);
      }
      setIsOpen(false);
    }, 100);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
      />

      {isOpen && (
        <div className="absolute z-40 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-72 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Loading locations…</div>
          ) : apiError ? (
            <div className="p-3 text-sm text-red-500">{apiError}</div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No locations found.</div>
          ) : (
            filteredLocations.map((location) => (
              <button
                type="button"
                key={location}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(location);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {location}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
