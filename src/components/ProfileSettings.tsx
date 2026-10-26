import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon,
  Camera,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Mail,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  Upload,
  UserCheck,
} from 'lucide-react';
import { auth, db } from '../firebase';
import { updatePassword, updateProfile, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ProfileSettingsProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  currentUser,
  onOpenAuth,
}) => {
  // Profile Photo state
  const [photoURL, setPhotoURL] = useState<string>('');
  const [googleDefaultPhoto, setGoogleDefaultPhoto] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState<boolean>(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState<string>('');
  const [photoErrorMsg, setPhotoErrorMsg] = useState<string>('');

  // Password update state
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string>('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('');

  // Profile Name edit state
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [nameSuccessMsg, setNameSuccessMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with current user & Firestore
  useEffect(() => {
    if (currentUser) {
      // Look for default Google photo from providerData
      const googleProvider = currentUser.providerData?.find(
        (p) => p.providerId === 'google.com'
      );
      const googlePhoto = googleProvider?.photoURL || currentUser.photoURL || '';
      setGoogleDefaultPhoto(googlePhoto);

      const initialName =
        currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
      setDisplayName(initialName);
      setNameInput(initialName);

      // Check if custom photo exists in Firestore
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.photoUrl) {
              setPhotoURL(data.photoUrl);
            } else {
              setPhotoURL(googlePhoto);
            }
            if (data.name) {
              setDisplayName(data.name);
              setNameInput(data.name);
            }
          } else {
            setPhotoURL(googlePhoto);
          }
        } catch (e) {
          console.warn('Firestore fetch user error:', e);
          setPhotoURL(googlePhoto);
        }
      };

      fetchUserData();
    } else {
      setPhotoURL('');
      setGoogleDefaultPhoto('');
      setDisplayName('Guest User');
    }
  }, [currentUser]);

  // Handle Photo Upload (from device)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setPhotoErrorMsg('Image size should be less than 4MB.');
      return;
    }

    setIsUpdatingPhoto(true);
    setPhotoErrorMsg('');
    setPhotoSuccessMsg('');

    try {
      // Convert file to Data URL
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Photo = reader.result as string;

        // Update in Firebase Auth
        if (auth.currentUser) {
          try {
            await updateProfile(auth.currentUser, {
              photoURL: base64Photo,
            });
          } catch (authErr) {
            console.warn('Auth photo update note:', authErr);
          }

          // Update in Firestore
          try {
            await setDoc(
              doc(db, 'users', auth.currentUser.uid),
              {
                uid: auth.currentUser.uid,
                photoUrl: base64Photo,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (dbErr) {
            console.warn('Firestore photo update note:', dbErr);
          }

          setPhotoURL(base64Photo);
          localStorage.setItem('pa_cached_photo', base64Photo);
          setPhotoSuccessMsg('Profile photo updated successfully!');
          setTimeout(() => setPhotoSuccessMsg(''), 4000);
        }
        setIsUpdatingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setPhotoErrorMsg(err.message || 'Failed to update photo.');
      setIsUpdatingPhoto(false);
    }
  };

  // Reset Photo to Google Default
  const handleResetToGooglePhoto = async () => {
    if (!auth.currentUser || !googleDefaultPhoto) return;
    setIsUpdatingPhoto(true);
    setPhotoErrorMsg('');
    setPhotoSuccessMsg('');

    try {
      await updateProfile(auth.currentUser, {
        photoURL: googleDefaultPhoto,
      });

      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          photoUrl: googleDefaultPhoto,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setPhotoURL(googleDefaultPhoto);
      localStorage.setItem('pa_cached_photo', googleDefaultPhoto);
      setPhotoSuccessMsg('Restored original Google account photo!');
      setTimeout(() => setPhotoSuccessMsg(''), 4000);
    } catch (err: any) {
      setPhotoErrorMsg(err.message || 'Failed to reset photo.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  // Handle Name update
  const handleUpdateName = async () => {
    if (!nameInput.trim() || !auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: nameInput.trim(),
      });
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          name: nameInput.trim(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setDisplayName(nameInput.trim());
      setIsEditingName(false);
      setNameSuccessMsg('Name updated!');
      setTimeout(() => setNameSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update name');
    }
  };

  // Handle Firebase Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!auth.currentUser) {
      setPasswordErrorMsg('Please log in first to update your password.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirm password do not match.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await updatePassword(auth.currentUser, newPassword);
      setPasswordSuccessMsg('Password successfully updated in Firebase!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(''), 5000);
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setPasswordErrorMsg(
          'Security check: This operation is sensitive and requires recent authentication. Please log out and sign in again before changing password.'
        );
      } else {
        setPasswordErrorMsg(
          err.message || 'Failed to update password. Please check your credentials.'
        );
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('pa_cached_photo');
      localStorage.removeItem('pa_cached_name');
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentUser) {
    return (
      <div className="space-y-5 w-full text-left pt-3">
        <div className="border-b border-[rgba(226,192,114,0.15)] pb-3">
          <h3 className="text-lg font-bold text-white">User Profile &amp; Settings</h3>
          <p className="text-xs text-slate-400">
            Sign in to manage your profile photo, Firebase credentials, and workspace preferences.
          </p>
        </div>

        <div className="bg-[#121216] p-8 rounded-3xl border border-[rgba(226,192,114,0.2)] text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[rgba(226,192,114,0.1)] border border-[#e2c072] flex items-center justify-center mx-auto text-2xl text-[#e2c072]">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">You are not signed in</h4>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with Google or your account credentials to customize your profile picture and secure your account.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-3 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-black text-xs rounded-xl shadow-md hover:brightness-110 transition cursor-pointer"
          >
            Sign In with Google / Account
          </button>
        </div>
      </div>
    );
  }

  const isGoogleAccount = currentUser.providerData.some(
    (p) => p.providerId === 'google.com'
  );

  return (
    <div className="space-y-6 w-full text-left pt-2 max-w-4xl">
      {/* Title */}
      <div className="border-b border-[rgba(226,192,114,0.15)] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👤</span> Profile &amp; Account Settings
          </h3>
          <p className="text-xs text-slate-400">
            Manage your Google default photo, custom avatar, and secure Firebase password.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] text-[#e2c072] border border-[rgba(226,192,114,0.3)] font-bold text-[11px] rounded-lg">
          PRO Suite
        </span>
      </div>

      {/* SECTION 1: PROFILE PICTURE & IDENTITY */}
      <div className="bg-[#121216] p-5 sm:p-6 rounded-3xl border border-[rgba(226,192,114,0.15)] card-shadow space-y-6">
        <div className="flex items-center justify-between border-b border-[rgba(226,192,114,0.1)] pb-3">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#e2c072]" />
            Profile Picture &amp; Personal Info
          </h4>
          <span className="text-[10px] text-slate-400">
            {isGoogleAccount ? 'Google Connected' : 'Email/Password Account'}
          </span>
        </div>

        {/* Avatar Display & Upload Actions */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#1c1c24] border-2 border-[#e2c072] shadow-lg flex items-center justify-center relative">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-[#e2c072]">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}

              {isUpdatingPhoto && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-[#e2c072] animate-spin" />
                </div>
              )}
            </div>

            {/* Quick change camera icon overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 bg-[#e2c072] hover:bg-[#f0d48f] text-[#070707] rounded-xl shadow-md cursor-pointer transition active:scale-95"
              title="Upload new photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-2.5 py-1 bg-[#181820] border border-[rgba(226,192,114,0.3)] rounded-lg text-white text-xs font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleUpdateName}
                      className="px-2 py-1 bg-[#e2c072] text-[#070707] rounded-lg text-[10px] font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="px-2 py-1 bg-[#1c1c24] text-slate-400 rounded-lg text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="text-base font-extrabold text-white truncate">
                      {displayName}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-[10px] text-[#e2c072] hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>{currentUser.email}</span>
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                UID: {currentUser.uid}
              </p>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdatingPhoto}
                className="px-3.5 py-1.5 bg-[#181820] hover:bg-[#22222c] border border-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUpdatingPhoto ? 'Updating...' : 'Upload New Photo'}</span>
              </button>

              {googleDefaultPhoto && photoURL !== googleDefaultPhoto && (
                <button
                  type="button"
                  onClick={handleResetToGooglePhoto}
                  disabled={isUpdatingPhoto}
                  className="px-3 py-1.5 bg-[#181820] hover:bg-[#22222c] border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#e2c072]" />
                  <span>Restore Google Photo</span>
                </button>
              )}
            </div>

            {/* Photo Feedback Messages */}
            {photoSuccessMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{photoSuccessMsg}</span>
              </div>
            )}
            {photoErrorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{photoErrorMsg}</span>
              </div>
            )}
            {nameSuccessMsg && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
                {nameSuccessMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: FIREBASE PASSWORD CHANGE */}
      <div className="bg-[#121216] p-5 sm:p-6 rounded-3xl border border-[rgba(226,192,114,0.15)] card-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(226,192,114,0.1)] pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#e2c072]" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Change Password (Firebase Security)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Encrypted on Firebase Auth</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Update your account password stored securely on Firebase. Ensure your new password is at least 6 characters with a combination of letters and numbers.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg pt-1">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                required
                className="w-full px-3.5 py-2.5 pr-10 bg-[#181820] border border-[rgba(226,192,114,0.25)] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#e2c072] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full px-3.5 py-2.5 bg-[#181820] border border-[rgba(226,192,114,0.25)] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#e2c072] transition"
            />
          </div>

          {passwordSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccessMsg}</span>
            </div>
          )}

          {passwordErrorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordErrorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="px-5 py-2.5 bg-gradient-to-r from-[#e2c072] to-[#c5a059] hover:brightness-110 text-[#070707] font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {isUpdatingPassword ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Updating Password on Firebase...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Save New Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* SECTION 3: SESSION MANAGEMENT */}
      <div className="bg-[#121216] p-4 sm:p-5 rounded-2xl border border-[rgba(226,192,114,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">
            Session &amp; Security Controls
          </span>
          <span className="text-[10px] text-slate-400">
            Sign out from all active workspace tabs on this device.
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500/35 transition cursor-pointer flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* SECTION 4: FULL PROJECT ARCHIVE (.ZIP) */}
      <div className="bg-[#121216] p-4 sm:p-5 rounded-2xl border border-[rgba(226,192,114,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>📦</span> Full Application Source Code (.ZIP)
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Download the complete PrimeAstra codebase including all components, tools, resume maker, and invoice generator.
          </span>
        </div>

        <a
          href="/primeastra_full_project.zip"
          download="primeastra_full_project.zip"
          className="px-4 py-2 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] rounded-xl text-xs font-black hover:brightness-110 transition flex items-center gap-2 shrink-0 cursor-pointer shadow"
        >
          <span>⬇️ Download Project (.ZIP)</span>
        </a>
      </div>
    </div>
  );
};
