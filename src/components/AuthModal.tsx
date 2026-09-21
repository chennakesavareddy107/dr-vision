import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, AlertCircle, CheckCircle, Hospital, Award, Flame } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { ClinicianUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: ClinicianUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAsGuest,
    resetPassword,
  } = useFirebase();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Attending Ophthalmologist');
  const [affiliation, setAffiliation] = useState('Wilmer Eye Institute, Johns Hopkins');
  const [licenseNumber, setLicenseNumber] = useState('MD-849102-EYE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const parseFirebaseError = (err: any): string => {
    const msg = err?.message || '';
    if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
      return 'Invalid email or password. Please verify your clinical credentials.';
    }
    if (msg.includes('auth/user-not-found')) {
      return 'No registered clinician found with this institutional email. You can register a new account below.';
    }
    if (msg.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (msg.includes('auth/weak-password')) {
      return 'Password is too weak. Please use at least 6 characters with letters and numbers.';
    }
    if (msg.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in popup was closed before completing verification.';
    }
    if (msg.includes('auth/network-request-failed')) {
      return 'Network timeout. Check your internet connection.';
    }
    return msg || 'Authentication failed. Please verify credentials.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg(`Password reset instructions sent to ${email}`);
        setLoading(false);
        return;
      }

      let clinician: ClinicianUser;
      if (mode === 'register') {
        clinician = await signUpWithEmail(
          email,
          password,
          name || 'Dr. Clinician',
          role,
          affiliation,
          licenseNumber
        );
      } else {
        clinician = await signInWithEmail(email, password);
      }

      if (onSuccess) onSuccess(clinician);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const clinician = await signInWithGoogle();
      if (onSuccess) onSuccess(clinician);
      onClose();
    } catch (err: any) {
      console.error('Firebase Google Auth Error:', err);
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: string) => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const clinician = await signInAsGuest(demoRole);
      if (onSuccess) onSuccess(clinician);
      onClose();
    } catch (err: any) {
      console.error('Quick demo error:', err);
      setError('Unable to authenticate demo session. Please try email sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <BrandLogo size="sm" />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Firebase Auth & Cloud</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1B3B]">
            {mode === 'login' && 'Doctor & Researcher Portal'}
            {mode === 'register' && 'Create Clinical Account'}
            {mode === 'forgot' && 'Reset Institutional Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' && 'Sign in to access real-time patient charts, inference histories, and AI tools.'}
            {mode === 'register' && 'Register your clinical credentials to persist patient diagnostics in Firebase.'}
            {mode === 'forgot' && 'Enter your verified hospital email to receive a recovery link.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Name & Degree
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Vance, MD"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Specialty / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Senior Retinal Specialist">Senior Retinal Specialist</option>
                    <option value="Attending Ophthalmologist">Attending Ophthalmologist</option>
                    <option value="Clinical Fellow">Clinical Fellow</option>
                    <option value="AI Medical Researcher">AI Medical Researcher</option>
                    <option value="Ophthalmic Technician">Ophthalmic Technician</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    License / NPI #
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="MD-849102"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Hospital / Institution
                </label>
                <div className="relative">
                  <Hospital className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="e.g. Wilmer Eye Institute, Johns Hopkins"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.med"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Workspace'}
                  {mode === 'register' && 'Register Clinician Profile'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        {mode !== 'forgot' && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Firebase Sign In button */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={loading}
              className="w-full py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google Firebase Auth</span>
            </button>
          </>
        )}

        {/* Quick Demo Clinician Presets */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Instant Demo Session</span>
            <span className="text-emerald-600 font-medium">No Password Required</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickDemo('Senior Retinal Specialist')}
              type="button"
              disabled={loading}
              className="flex-1 text-[11px] py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Dr. Sarah Lin (Lead)
            </button>
            <button
              onClick={() => handleQuickDemo('Clinical Fellow')}
              type="button"
              disabled={loading}
              className="flex-1 text-[11px] py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Dr. Kevin Zhao (Fellow)
            </button>
          </div>
        </div>

        {/* Bottom Mode Switcher */}
        <div className="mt-4 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have a clinical account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

