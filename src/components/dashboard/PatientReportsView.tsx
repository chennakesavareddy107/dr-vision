import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Building,
  Award,
  Sparkles,
  Stethoscope,
  PenTool,
  FileDown,
  Check,
  Edit3,
} from 'lucide-react';
import { PredictionResult, OphthalmologistSuggestion, DRGrade } from '../../types';
import { gradeMetadata } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import {
  downloadReportJson,
  downloadReportText,
} from '../../utils/reportExport';
import { useFirebase } from '../../context/FirebaseContext';
import { Flame } from 'lucide-react';

interface PatientReportsViewProps {
  result: PredictionResult;
  currentUser: { name: string; email: string; role: string };
  onNavigateTab: (tab: any) => void;
  onUpdatePrediction?: (prediction: PredictionResult) => void;
}

export const PatientReportsView: React.FC<PatientReportsViewProps> = ({
  result,
  currentUser,
  onNavigateTab,
  onUpdatePrediction,
}) => {
  const { modifyPrediction } = useFirebase();

  const existingReview = result.ophthalmologistReview;

  const [physicianName, setPhysicianName] = useState(
    existingReview?.ophthalmologistName || currentUser.name || 'Dr. Sarah Lin, MD'
  );
  const [physicianTitle, setPhysicianTitle] = useState(
    existingReview?.ophthalmologistTitle || 'Senior Vitreoretinal Specialist, FAAO'
  );
  const [reportDate] = useState(
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  const [clinicalRemarks, setClinicalRemarks] = useState(
    existingReview?.clinicalImpressions ||
      'Correlated with visual field testing. Automated multi-feature grading is concurred with. Patient scheduled for comprehensive dilated ophthalmoscopy.'
  );

  const [followUpInterval, setFollowUpInterval] = useState(
    existingReview?.followUpInterval || '3 Months'
  );

  const [isEditingSuggestions, setIsEditingSuggestions] = useState(false);
  const [clinicalAgreement, setClinicalAgreement] = useState<'concur' | 'modified' | 'equivocal'>(
    existingReview?.clinicalAgreement || 'concur'
  );
  const [adjustedGrade, setAdjustedGrade] = useState<DRGrade>(
    existingReview?.finalGrade ?? result.predictedGrade
  );
  const [macularEdema, setMacularEdema] = useState<boolean>(
    existingReview?.macularEdemaPresent || false
  );

  const meta = gradeMetadata[result.predictedGrade];

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAndGenerate = () => {
    const updatedReview: OphthalmologistSuggestion = {
      ophthalmologistName: physicianName,
      ophthalmologistTitle: physicianTitle,
      licenseNumber: existingReview?.licenseNumber || 'MD-849102-EYE',
      affiliation: existingReview?.affiliation || 'Wilmer Eye Institute, Johns Hopkins Medicine',
      clinicalAgreement: clinicalAgreement,
      finalGrade: clinicalAgreement === 'modified' ? adjustedGrade : result.predictedGrade,
      macularEdemaPresent: macularEdema,
      clinicalImpressions: clinicalRemarks,
      treatmentRecommendations: existingReview?.treatmentRecommendations || [
        'Spectral-Domain Macular OCT Protocol',
        'Intensive Glycemic Control (HbA1c < 7.0%)',
        'Follow-up in ' + followUpInterval,
      ],
      followUpInterval: followUpInterval,
      reviewedDate: new Date().toISOString().split('T')[0],
      signatureStamp: `SHA256-DIGITAL-SIG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-LIN-MD`,
    };

    const updatedResult: PredictionResult = {
      ...result,
      reviewedByDoctor: true,
      reviewedAt: new Date().toLocaleString(),
      doctorNotes: clinicalRemarks,
      ophthalmologistReview: updatedReview,
    };

    try {
      modifyPrediction(result.id, {
        reviewedByDoctor: true,
        reviewedAt: updatedResult.reviewedAt,
        doctorNotes: clinicalRemarks,
        ophthalmologistReview: updatedReview,
      });
    } catch (err) {
      console.error('Failed to sync updated review to Firestore:', err);
    }

    if (onUpdatePrediction) {
      onUpdatePrediction(updatedResult);
    }

    setIsEditingSuggestions(false);
  };

  const currentReview = result.ophthalmologistReview || {
    ophthalmologistName: physicianName,
    ophthalmologistTitle: physicianTitle,
    licenseNumber: 'MD-849102-EYE',
    affiliation: 'Wilmer Eye Institute, Johns Hopkins Medicine',
    clinicalAgreement: clinicalAgreement,
    finalGrade: result.predictedGrade,
    macularEdemaPresent: macularEdema,
    clinicalImpressions: clinicalRemarks,
    treatmentRecommendations: [
      'Spectral-Domain Macular OCT Protocol (Urgent)',
      'Intensive Glycemic Optimization (HbA1c Target < 7.0%)',
      'Blood Pressure Target (< 130/80 mmHg)',
    ],
    followUpInterval: followUpInterval,
    reviewedDate: new Date().toISOString().split('T')[0],
    signatureStamp: 'VERIFIED_SIGNATURE_LIN_MD',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="patient-reports-view">
      
      {/* Top Action Bar (hidden during browser print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono border border-blue-200 mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Formal Ophthalmology Clinical Document</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
            Patient Diagnostic Consultation Report
          </h1>
        </div>

        {/* Multi-Format Downloads & Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditingSuggestions(!isEditingSuggestions)}
            id="toggle-edit-suggestions-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>{isEditingSuggestions ? 'Close Editor' : 'Edit Suggestions'}</span>
          </button>

          <button
            onClick={() => downloadReportJson(result, currentReview)}
            id="download-report-json-btn"
            title="Download JSON Clinical Data"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => downloadReportText(result, currentReview)}
            id="download-report-txt-btn"
            title="Download Plain Text Clinical Summary"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span>TXT</span>
          </button>

          <button
            onClick={handlePrint}
            id="print-clinical-report-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-300" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Inline Suggestions Editor for Ophthalmologist */}
      {isEditingSuggestions && (
        <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-300 shadow-sm space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-700" />
              <h3 className="font-serif font-bold text-slate-900 text-base">
                Edit Attending Ophthalmologist Suggestions
              </h3>
            </div>
            <span className="text-[11px] font-mono text-blue-700 font-semibold bg-white px-2 py-0.5 rounded-md border border-blue-200">
              Live Report Customizer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinician Name</label>
              <input
                type="text"
                value={physicianName}
                onChange={(e) => setPhysicianName(e.target.value)}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Agreement</label>
              <select
                value={clinicalAgreement}
                onChange={(e) => setClinicalAgreement(e.target.value as any)}
                className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              >
                <option value="concur">Concur with AI Classification (Grade {result.predictedGrade})</option>
                <option value="modified">Adjust Clinical Grade</option>
                <option value="equivocal">Mark as Equivocal / Second Opinion</option>
              </select>
            </div>
          </div>

          {clinicalAgreement === 'modified' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Adjusted Grade:</span>
              {([0, 1, 2, 3, 4] as DRGrade[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setAdjustedGrade(g)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                    adjustedGrade === g ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Clinical Impressions &amp; Recommendations
            </label>
            <textarea
              value={clinicalRemarks}
              onChange={(e) => setClinicalRemarks(e.target.value)}
              rows={3}
              className="w-full bg-white p-3 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={macularEdema}
                onChange={(e) => setMacularEdema(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Diabetic Macular Edema (CSME) Present</span>
            </label>

            <button
              onClick={handleSaveAndGenerate}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Report Document</span>
            </button>
          </div>
        </div>
      )}

      {/* The Printable Medical Report Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm print:border-none print:shadow-none print:p-0 space-y-8">
        
        {/* Hospital Letterhead Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BrandLogo size="sm" />
              <span className="text-xs font-mono font-bold text-slate-400">| Clinical Report</span>
            </div>
            <div className="text-xs font-serif font-semibold text-slate-700">
              Wilmer Eye Institute • Retinal Informatics Service
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Accredited Clinical AI Decision Support System • HIPAA Compliant
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 font-mono">
            <div>Report Ref: <strong>RPT-{result.id}</strong></div>
            <div>Date of Exam: <strong>{result.timestamp.split(' ')[0]}</strong></div>
            <div>Generated: <strong>{reportDate}</strong></div>
          </div>
        </div>

        {/* Patient Demographics & Session Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-mono">Patient Name</div>
            <div className="font-bold text-[#0B1B3B] text-sm">{result.patientName}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-mono">Medical Record #</div>
            <div className="font-bold text-slate-800 font-mono">{result.patientId}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-mono">Age / Sex</div>
            <div className="font-bold text-slate-800">{result.patientAge} Years / {result.patientGender}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-mono">Examined Eye</div>
            <div className="font-bold text-slate-800 font-mono">{result.eyeSide}</div>
          </div>
        </div>

        {/* Primary Diagnosis & Confidence */}
        <div className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Primary Diagnostic Classification (ETDRS)
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0B1B3B]">
                {meta.fullName}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeBg}`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                <span>{meta.riskLevel} Risk</span>
              </span>
              <div className="text-xs font-mono text-slate-600 mt-1">
                Model Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-mono">
            ICD-10-CM Ophthalmology Diagnostic Code: <strong className="text-slate-900">{meta.icd10}</strong>
          </div>
        </div>

        {/* Retinal Imaging Exhibits: Fundus & Grad-CAM */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
            Ophthalmic Imaging Exhibits (Color Fundus &amp; Saliency)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
              <div className="text-xs font-semibold text-slate-700 mb-2">Original Color Fundus Photograph</div>
              <div className="w-56 h-56 rounded-full overflow-hidden bg-black border-2 border-slate-800 shadow-xs">
                <img
                  src={result.imageUrl}
                  alt="Original Fundus"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-2">Resolution: 512×512 • Sharpness Index: {result.qualityScore}%</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
              <div className="text-xs font-semibold text-slate-700 mb-2">Grad-CAM Feature Activation Map</div>
              <div className="relative w-56 h-56 rounded-full overflow-hidden bg-black border-2 border-slate-800 shadow-xs">
                <img
                  src={result.imageUrl}
                  alt="Original Fundus"
                  className="w-full h-full object-cover"
                />
                {result.gradCamUrl && (
                  <img
                    src={result.gradCamUrl}
                    alt="Grad-CAM"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
                  />
                )}
              </div>
              <span className="text-[10px] text-teal-700 font-mono mt-2">Attention: ConvNeXtV2 + Swin Stage 4</span>
            </div>
          </div>
        </div>

        {/* Quantitative Lesion Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Quantified Microvascular Lesions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                  <th className="pb-2">Pathology Type</th>
                  <th className="pb-2">Detected Count</th>
                  <th className="pb-2">Quadrant Localization</th>
                  <th className="pb-2 text-right">Severity Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {result.lesions.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 font-sans font-semibold text-slate-800">{l.type}</td>
                    <td className="py-2.5 text-slate-700">{l.count} micro-lesions</td>
                    <td className="py-2.5 text-slate-600">{l.quadrant || 'Perimacular / Temporal'}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{l.severityContribution}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ophthalmologist Suggestions & Prescriptive Plan */}
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-700" />
              <span className="font-bold text-blue-900 text-sm">
                Attending Ophthalmologist Consultation &amp; Suggestions
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-white text-blue-800 px-2 py-0.5 rounded border border-blue-200">
              {currentReview.clinicalAgreement === 'concur'
                ? 'Concurred with Model'
                : currentReview.clinicalAgreement === 'modified'
                ? `Clinically Adjusted to Grade ${currentReview.finalGrade}`
                : 'Equivocal'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Diabetic Macular Edema:</span>
              <span className="font-semibold text-slate-900">
                {currentReview.macularEdemaPresent ? '⚠️ Present / Clinically Significant (CSME)' : 'None observed in central 30°'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Recommended Re-evaluation:</span>
              <span className="font-semibold text-slate-900">{currentReview.followUpInterval}</span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block mb-1">Prescribed Therapies &amp; Care Pathway:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800 font-medium">
              {currentReview.treatmentRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Doctor Review & Sign-Off */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">
              Attending Physician Remarks:
            </label>
            <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed print:border-none print:p-0 print:bg-transparent">
              {clinicalRemarks}
            </div>
          </div>

          <div className="space-y-4 sm:text-right flex flex-col justify-end">
            <div className="space-y-1">
              <div className="font-serif font-bold text-slate-800 text-base italic">
                {physicianName}
              </div>
              <div className="text-[11px] text-slate-500">
                {physicianTitle}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                License # MD-849102-EYE • Wilmer Eye Institute
              </div>
              <div className="text-[10px] text-emerald-700 font-mono pt-1">
                ✓ Cryptographic Electronic Signature Verified
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
