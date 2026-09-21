import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Calendar,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Flame,
  FileCheck,
  AlertCircle,
  Activity,
  Phone,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import { samplePredictions, gradeMetadata } from '../../data/mockData';
import { Patient, DRGrade, PredictionResult } from '../../types';
import { useFirebase } from '../../context/FirebaseContext';

interface PatientRecordsViewProps {
  onSelectPatient: (patient: Patient) => void;
  onDiagnosePatient: (prediction: PredictionResult) => void;
  onNavigateTab: (tab: any) => void;
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  onSelectPatient,
  onDiagnosePatient,
  onNavigateTab,
}) => {
  const { patients, addPatient, editPatient, removePatient, isConnectedToFirebase } = useFirebase();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form state for Add/Edit
  const [formName, setFormName] = useState('');
  const [formMrn, setFormMrn] = useState('');
  const [formAge, setFormAge] = useState<number>(55);
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [formDiabetesType, setFormDiabetesType] = useState<'Type 1' | 'Type 2' | 'Gestational'>('Type 2');
  const [formDuration, setFormDuration] = useState<number>(10);
  const [formHbA1c, setFormHbA1c] = useState<number>(7.4);
  const [formVaOD, setFormVaOD] = useState('20/30');
  const [formVaOS, setFormVaOS] = useState('20/25');
  const [formGrade, setFormGrade] = useState<DRGrade>(1);
  const [formStatus, setFormStatus] = useState<'Routine Follow-up' | 'Review Required' | 'Urgent Referral' | 'Stable'>('Routine Follow-up');
  const [formPhone, setFormPhone] = useState('+1 (555) 234-8900');
  const [formEmail, setFormEmail] = useState('patient@hospital.org');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    const randomMrn = `MRN-${Math.floor(100000 + Math.random() * 900000)}`;
    setFormName('');
    setFormMrn(randomMrn);
    setFormAge(58);
    setFormGender('Female');
    setFormDiabetesType('Type 2');
    setFormDuration(8);
    setFormHbA1c(7.2);
    setFormVaOD('20/25');
    setFormVaOS('20/20');
    setFormGrade(1);
    setFormStatus('Routine Follow-up');
    setFormPhone('+1 (555) 389-1029');
    setFormEmail('patient.record@clinical.med');
    setFormNotes('Referred by primary endocrinologist for annual retinal screening.');
    setIsAddModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setFormName(patient.name);
    setFormMrn(patient.mrn);
    setFormAge(patient.age);
    setFormGender(patient.gender);
    setFormDiabetesType(patient.diabetesType);
    setFormDuration(patient.durationYears);
    setFormHbA1c(patient.hbA1c);
    setFormVaOD(patient.visualAcuityOD);
    setFormVaOS(patient.visualAcuityOS);
    setFormGrade(patient.currentGrade);
    setFormStatus(patient.status);
    setFormPhone(patient.phone);
    setFormEmail(patient.email);
    setFormNotes(patient.notes || '');
    setIsEditModalOpen(true);
  };

  const handleSaveNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    try {
      const newPatient: Patient = {
        id: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
        mrn: formMrn || `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
        name: formName.trim(),
        age: Number(formAge) || 50,
        gender: formGender,
        diabetesType: formDiabetesType,
        durationYears: Number(formDuration) || 5,
        hbA1c: Number(formHbA1c) || 7.0,
        lastExamDate: new Date().toISOString().split('T')[0],
        currentGrade: formGrade,
        visualAcuityOD: formVaOD || '20/20',
        visualAcuityOS: formVaOS || '20/20',
        status: formStatus,
        phone: formPhone || '+1 (555) 000-0000',
        email: formEmail || 'patient@example.med',
        predictionsCount: 0,
        notes: formNotes,
      };

      await addPatient(newPatient);
      setSelectedPatient(newPatient);
      setIsAddModalOpen(false);
      setActionSuccess(`Patient record for ${newPatient.name} saved to Firebase Firestore!`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error('Error adding patient:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<Patient> = {
        name: formName.trim(),
        mrn: formMrn,
        age: Number(formAge),
        gender: formGender,
        diabetesType: formDiabetesType,
        durationYears: Number(formDuration),
        hbA1c: Number(formHbA1c),
        visualAcuityOD: formVaOD,
        visualAcuityOS: formVaOS,
        currentGrade: formGrade,
        status: formStatus,
        phone: formPhone,
        email: formEmail,
        notes: formNotes,
      };

      await editPatient(selectedPatient.id, updates);
      setSelectedPatient((prev) => (prev ? { ...prev, ...updates } : null));
      setIsEditModalOpen(false);
      setActionSuccess(`Patient chart updated in Firebase Firestore.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error('Error updating patient:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete patient record for ${name}? This action synchronizes to Firebase Firestore.`)) {
      return;
    }

    try {
      await removePatient(id, name);
      if (selectedPatient?.id === id) {
        setSelectedPatient(patients.find((p) => p.id !== id) || null);
      }
      setActionSuccess(`Patient record ${name} removed from cloud database.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diabetesType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade =
      gradeFilter === 'all' ||
      p.currentGrade.toString() === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="patient-records-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono border border-emerald-200">
              <Users className="w-3.5 h-3.5" />
              <span>Electronic Patient Records (EPR)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-mono border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
              <span>Firebase Firestore Synced</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
            Patient Cohorts & Longitudinal Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time cloud database of patient clinical histories, visual acuities, HbA1c trajectories, and fundus scan records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Patient</span>
          </button>
          
          <button
            onClick={() => onNavigateTab('upload')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Scan Fundus</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patient name, MRN, email, or diabetes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">Filter Grade:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Grades ({patients.length} records)</option>
            <option value="0">Grade 0: No DR</option>
            <option value="1">Grade 1: Mild NPDR</option>
            <option value="2">Grade 2: Moderate NPDR</option>
            <option value="3">Grade 3: Severe NPDR</option>
            <option value="4">Grade 4: Proliferative DR</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Patients List on Left, Selected Patient Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Patient Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Active Patient Registry ({filteredPatients.length} shown)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Cloud Firestore
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                  <th className="pb-3 pl-2">Patient / MRN</th>
                  <th className="pb-3">Visual Acuity</th>
                  <th className="pb-3">HbA1c</th>
                  <th className="pb-3">Current Grade</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      No matching patients found. Click "Add New Patient" to register a patient record.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => {
                    const meta = gradeMetadata[patient.currentGrade] || gradeMetadata[0];
                    const isSelected = selectedPatient?.id === patient.id;

                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="font-bold text-[#0B1B3B]">{patient.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {patient.mrn} • {patient.age}y {patient.gender[0]}
                          </div>
                        </td>

                        <td className="py-3.5 font-mono text-slate-600">
                          OD {patient.visualAcuityOD} | OS {patient.visualAcuityOS}
                        </td>

                        <td className="py-3.5 font-mono font-bold text-slate-700">
                          {patient.hbA1c}%
                        </td>

                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.badgeBg}`}>
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: meta.color }}
                            />
                            <span>{meta.name}</span>
                          </span>
                        </td>

                        <td className="py-3.5 text-right pr-2">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const matchedPred = samplePredictions.find((p) => p.patientId === patient.id || p.patientName === patient.name) || samplePredictions[0];
                                onDiagnosePatient({
                                  ...matchedPred,
                                  patientName: patient.name,
                                  patientId: patient.mrn,
                                  patientAge: patient.age,
                                });
                                onNavigateTab('diagnostic');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B1B3B] hover:text-white text-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Review</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePatient(patient.id, patient.name);
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete Patient Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Patient Longitudinal Detail Card */}
        <div className="lg:col-span-5 space-y-6">
          {selectedPatient ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Patient Clinical Profile
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedPatient.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#0B1B3B] mt-0.5">
                    {selectedPatient.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    MRN: {selectedPatient.mrn} • ID: {selectedPatient.id}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(selectedPatient)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Edit Patient Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(selectedPatient.id, selectedPatient.name)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                    title="Delete Patient Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Glycated Hemoglobin (HbA1c)</div>
                  <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{selectedPatient.hbA1c}%</div>
                  <div className="text-[10px] text-rose-600 font-medium mt-0.5">
                    {selectedPatient.hbA1c > 7.5 ? 'Poor glycemic control' : 'Adequate glycemic target'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Visual Acuity (Snellen)</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-1">
                    OD: <span className="text-blue-700">{selectedPatient.visualAcuityOD}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    OS: <span className="text-blue-700">{selectedPatient.visualAcuityOS}</span>
                  </div>
                </div>
              </div>

              {/* Patient Demographics & Diabetes Timeline */}
              <div className="space-y-2 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Age & Gender:</span>
                    <span className="font-semibold text-slate-800">{selectedPatient.age} Years • {selectedPatient.gender}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Diagnosis:</span>
                    <span className="font-semibold text-slate-800">{selectedPatient.diabetesType} ({selectedPatient.durationYears} yrs)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Last Comprehensive Scan:</span>
                    <span className="font-mono text-slate-700">{selectedPatient.lastExamDate || 'Recent'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Contact:</span>
                    <span className="text-slate-700 truncate max-w-[200px]">{selectedPatient.email}</span>
                  </div>
                </div>

                {selectedPatient.notes && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-slate-700 text-xs">
                    <span className="font-semibold text-blue-900 block mb-0.5">Clinical Notes:</span>
                    <p className="italic text-slate-600">{selectedPatient.notes}</p>
                  </div>
                )}
              </div>

              {/* Launch Retinal AI Scan CTA */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    const matchedPred = samplePredictions.find((p) => p.patientId === selectedPatient.id || p.patientName === selectedPatient.name) || samplePredictions[0];
                    onDiagnosePatient({
                      ...matchedPred,
                      patientName: selectedPatient.name,
                      patientId: selectedPatient.mrn,
                      patientAge: selectedPatient.age,
                    });
                    onNavigateTab('diagnostic');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Latest AI Diagnostic Workup</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateTab('upload')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload & Run New Retinal Scan for {selectedPatient.name}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
              Select a patient from the records table to view full chart and diagnostic logs.
            </div>
          )}
        </div>

      </div>

      {/* Add New Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                <Flame className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                <span>Firestore Cloud Store</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#0B1B3B]">
                Register New Patient Record
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Create a permanent patient profile in the HIPAA-compliant clinical database.
              </p>
            </div>

            <form onSubmit={handleSaveNewPatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Patient Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Margaret Holloway"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hospital MRN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMrn}
                    onChange={(e) => setFormMrn(e.target.value)}
                    placeholder="MRN-894102"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    HbA1c (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={4}
                    max={16}
                    value={formHbA1c}
                    onChange={(e) => setFormHbA1c(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Diabetes Classification
                  </label>
                  <select
                    value={formDiabetesType}
                    onChange={(e) => setFormDiabetesType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Type 2">Type 2 Diabetes</option>
                    <option value="Type 1">Type 1 Diabetes</option>
                    <option value="Gestational">Gestational Diabetes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Diagnosis Duration (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Visual Acuity OD (Right Eye)
                  </label>
                  <input
                    type="text"
                    value={formVaOD}
                    onChange={(e) => setFormVaOD(e.target.value)}
                    placeholder="20/25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Visual Acuity OS (Left Eye)
                  </label>
                  <input
                    type="text"
                    value={formVaOS}
                    onChange={(e) => setFormVaOS(e.target.value)}
                    placeholder="20/20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Initial DR Stage
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value) as DRGrade)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Grade 0: No DR</option>
                    <option value={1}>Grade 1: Mild NPDR</option>
                    <option value={2}>Grade 2: Moderate NPDR</option>
                    <option value={3}>Grade 3: Severe NPDR</option>
                    <option value={4}>Grade 4: Proliferative DR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Clinical Priority Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Routine Follow-up">Routine Follow-up</option>
                    <option value="Review Required">Review Required</option>
                    <option value="Urgent Referral">Urgent Referral</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Attending Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Clinical history, systemic complications, current medications..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Saving to Firestore...' : 'Save Patient Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h2 className="text-xl font-serif font-bold text-[#0B1B3B]">
                Edit Patient Record: {selectedPatient.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update clinical metrics, follow-up priority, and attending notes in Firestore.
              </p>
            </div>

            <form onSubmit={handleUpdatePatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    HbA1c (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formHbA1c}
                    onChange={(e) => setFormHbA1c(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Priority Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Routine Follow-up">Routine Follow-up</option>
                    <option value="Review Required">Review Required</option>
                    <option value="Urgent Referral">Urgent Referral</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Visual Acuity OD
                  </label>
                  <input
                    type="text"
                    value={formVaOD}
                    onChange={(e) => setFormVaOD(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Visual Acuity OS
                  </label>
                  <input
                    type="text"
                    value={formVaOS}
                    onChange={(e) => setFormVaOS(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Updated Notes & Clinical Instructions
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Updating Firestore...' : 'Update Chart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
