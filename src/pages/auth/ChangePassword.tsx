import { useState } from 'react';
import { changePassword } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setError(null);
    if (!oldPassword || !newPassword) return setError('Fill both fields');
    if (newPassword !== confirm) return setError('New passwords do not match');
    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      // After changing password, log out the user to re-authenticate
      alert('Password changed. Please log in with your new password.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-3">Change password</h2>
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      <div className="grid gap-2">
        <input type="password" placeholder="Current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="input" />
        <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" />
        <input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" />
        <div className="flex gap-2 mt-2">
          <button onClick={submit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Change</button>
        </div>
      </div>
    </div>
  );
}
