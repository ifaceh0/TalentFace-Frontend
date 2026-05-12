import { useState } from 'react';
import FormField from '../ui/FormField';
import { updateAddress } from '../../services/joinee.service';
import type { JoineeProfile, Address } from '../../types/joinee.types';

interface AddressFormProps {
  profile: JoineeProfile;
  onUpdate: (p: JoineeProfile) => void;
}

const emptyAddr = (): Address => ({ line1: '', city: '', state: '', pincode: '', country: 'India' });

export default function AddressForm({ profile, onUpdate }: AddressFormProps) {
  const [addr, setAddr] = useState<Address>(profile.address ?? emptyAddr());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const change = (field: keyof Address, value: string) =>
    setAddr((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await updateAddress(addr);
      onUpdate({ ...profile, address: res.address });
      setMsg({ type: 'success', text: 'Address updated!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Address</h2>
        <p className="text-sm text-gray-500 mt-1">Your current address information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">📍</span> Address Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField
                label="Address Line 1"
                value={addr.line1 ?? ''}
                onChange={(e) => change('line1', (e.target as HTMLInputElement).value)}
                placeholder="House no., Street name"
              />
            </div>
            <FormField
              label="City"
              value={addr.city ?? ''}
              onChange={(e) => change('city', (e.target as HTMLInputElement).value)}
              placeholder="City"
            />
            <FormField
              label="State"
              value={addr.state ?? ''}
              onChange={(e) => change('state', (e.target as HTMLInputElement).value)}
              placeholder="State"
            />
            <FormField
              label="Pincode"
              value={addr.pincode ?? ''}
              onChange={(e) => change('pincode', (e.target as HTMLInputElement).value)}
              placeholder="560001"
              maxLength={6}
            />
            <FormField
              label="Country"
              value={addr.country ?? 'India'}
              onChange={(e) => change('country', (e.target as HTMLInputElement).value)}
              placeholder="India"
            />
          </div>
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
          {loading ? 'Saving…' : 'Save Address'}
        </button>
      </form>
    </div>
  );
}
