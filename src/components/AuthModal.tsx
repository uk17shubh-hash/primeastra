import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PrimeAstraLogo } from './Logo';
import { auth, db } from '../firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let profileData = {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        photoUrl: user.photoURL || '',
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          ...profileData,
          createdAt: new Date().toISOString(),
        });
      } else {
        profileData = userSnap.data() as any;
      }
      onSuccess(profileData);
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isRegistering) {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const newProfile = {
          uid: cred.user.uid,
          name: authName.trim() || 'User',
          email: authEmail.trim(),
          photoUrl: '',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        onSuccess(newProfile);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-[390px] bg-white rounded-3xl shadow-floating border border-slate-100 p-6 md:p-7 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <PrimeAstraLogo className="w-12 h-12 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-slate-900">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering ? 'Sign up to sync your resume & tools' : 'Sign in to access your profile'}
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
            {authError}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={authLoading}
          className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 mb-4 shadow-sm transition cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-2 my-3 text-slate-400 text-[10px]">
          <div className="flex-1 border-t border-slate-200" />
          <span>OR EMAIL</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-3">
          {isRegistering && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="e.g. Shubham Singh"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-70 mt-2"
          >
            {authLoading ? 'Please wait...' : isRegistering ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setAuthError('');
            }}
            className="text-purple-600 font-bold hover:underline cursor-pointer"
          >
            {isRegistering ? 'Log in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
};