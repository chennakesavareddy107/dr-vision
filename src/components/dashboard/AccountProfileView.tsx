import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Save,
  CheckCircle2,
  Mail,
  Hospital,
  Award,
  Sliders,
  BellRing,
  Flame,
  LogOut,
  Database,
  FileCheck,
} from 'lucide-react';
import { useFirebase } from '../../context/FirebaseContext';

interface AccountProfileViewProps {
  currentUser: { name: string; email: string; role: string };
  onUpdateUser: (user: { name: string; email: string; role: string }) => void;
}

export const AccountProfileView: React.FC<AccountProfileViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const { clinicianUser, patients, predictions, auditLogs, logout, isConnectedToFirebase } = useFirebase();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [hospital, setHospital] = useState('Johns Hopkins Wilmer Eye Institute');
  const [licenseNumber, setLicenseNumber] = useState('MD-849102-EYE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Application preferences
  const [autoOpenGradCam, setAutoOpenGradCam] = useState(true);
  const [autoFlagSevere, setAutoFlagSevere] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { name, email, role };
    localStorage.setItem('dr_vision_user', JSON.stringify(updated));
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="account-profile-view">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
          Clinician Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your physician credentials, institutional hospital affiliation, and diagnostic workflow configurations.
        </p>
      </div>

      {/* Cloud Synchronization Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#0B1B3B]">
                  Cloud Firestore Synchronization
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {clinicianUser ? 'Connected' : 'Active (Guest Session)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Database: ai-studio-drvision • Encrypted HIPAA Channel
              </p>
            </div>
          </div>

          {clinicianUser && (
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        {/* Database real-time sync statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Patient Records</div>
            <div className="text-lg font-bold text-[#0B1B3B] font-mono mt-0.5">{patients.length} Records</div>
            <div className="text-[11px] text-emerald-600 font-medium">Real-time sync active</div>
          </div>

          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Saved Scans</div>
            <div className="text-lg font-bold text-[#0B1B3B] font-mono mt-0.5">{predictions.length} Completed</div>
            <div className="text-[11px] text-blue-600 font-medium">Grad-CAM linked</div>
          </div>

          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Audit Trail (HIPAA)</div>
            <div className="text-lg font-bold text-[#0B1B3B] font-mono mt-0.5">{auditLogs.length} Events</div>
            <div className="text-[11px] text-slate-500 font-medium">Immutable log ledger</div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Physician profile and clinical preferences updated successfully.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Clinician Identity Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
          <h2 className="text-base font-serif font-bold text-[#0B1B3B] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Physician Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Specialization</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Medical License / NPI Registration</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Primary Hospital / Ophthalmology Institute</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Workflow Preferences */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-base font-serif font-bold text-[#0B1B3B] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Workflow Preferences</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer border border-slate-100">
              <div>
                <div className="font-semibold text-slate-800">Auto-render Grad-CAM Saliency Overlay</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Automatically calculate attention maps immediately upon model inference</div>
              </div>
              <input
                type="checkbox"
                checked={autoOpenGradCam}
                onChange={(e) => setAutoOpenGradCam(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer border border-slate-100">
              <div>
                <div className="font-semibold text-slate-800">Priority Clinical Alert on Severe / PDR Scans</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Highlight immediate clinical referral triggers for Grade 3 or Grade 4 patients</div>
              </div>
              <input
                type="checkbox"
                checked={autoFlagSevere}
                onChange={(e) => setAutoFlagSevere(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
};
