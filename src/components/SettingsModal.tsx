import React, { useState } from 'react';
import { Settings, Lock, Camera, Trash2, X } from 'lucide-react';
import { db } from '../firebase';
import { User, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface SettingsModalProps {
  currentUser: User;
  userData: any;
  avatarUrl: string;
  onClose: () => void;
  onUserDataUpdate: (newData: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  userData,
  avatarUrl,
  onClose,
  onUserDataUpdate,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), { photoUrl: base64String });
          onUserDataUpdate({ ...userData, photoUrl: base64String });
          setSettingsMsg('Profile photo updated successfully!');
        } catch {
          setSettingsError('Failed to update photo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentUser) return;
    setSettingsError('');
    setSettingsMsg('');
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { photoUrl: '' });
      onUserDataUpdate({ ...userData, photoUrl: '' });
      setSettingsMsg('Profile photo removed!');
    } catch {
      setSettingsError('Failed to remove photo.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSettingsError('');
    setSettingsMsg('');
    setSettingsLoading(true);

    try {
      await updatePassword(currentUser, newPassword);
      setSettingsMsg('Password updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      setSettingsError(err.message || 'Error updating password.');
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-floating border border-slate-100 p-6 md:p-7 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Profile &amp; Settings</h3>
        </div>

        {settingsMsg && (
          <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
            {settingsMsg}
          </div>
        )}
        {settingsError && (
          <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
            {settingsError}
          </div>
        )}

        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 border border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">Profile Photo</p>
            <p className="text-[11px] text-slate-500 mb-2">Change or remove your profile picture</p>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer transition shadow-2xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {(userData?.photoUrl || currentUser?.photoURL) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-semibold text-rose-600 hover:bg-rose-100 cursor-pointer transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3.5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Change Password</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={settingsLoading}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-70"
          >
            {settingsLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};