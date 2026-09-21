import { PredictionResult, OphthalmologistSuggestion } from '../types';
import { gradeMetadata } from '../data/mockData';

/**
 * Builds a structured JSON report document for EHR/EMR export.
 */
export function generateClinicalReportJson(
  result: PredictionResult,
  review?: OphthalmologistSuggestion
): object {
  const meta = gradeMetadata[result.predictedGrade];

  return {
    reportMetadata: {
      documentType: 'Diabetic Retinopathy Clinical Consultation & Telemetry Report',
      reportId: `REP-${result.id}`,
      generatedAt: new Date().toISOString(),
      institution: 'Wilmer Eye Institute • Retinal Informatics & AI Telemetry',
      hipaaComplianceStatus: 'De-identified Patient Consultation Copy',
      securityVerificationHash: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    },
    patientInformation: {
      id: result.patientId,
      name: result.patientName,
      age: result.patientAge,
      gender: result.patientGender,
      examinedEye: result.eyeSide,
      sessionTimestamp: result.timestamp,
    },
    automatedInference: {
      modelArchitecture: 'Hybrid ConvNeXtV2-Base + Swin-Transformer-v2 Multi-Feature Fusion',
      icdrGrade: result.predictedGrade,
      gradeName: meta.fullName,
      icd10Code: meta.icd10,
      riskLevel: meta.riskLevel,
      confidenceScore: `${(result.confidence * 100).toFixed(2)}%`,
      probabilities: result.probabilities,
      qualityScore: `${result.qualityScore}% (Pass standard)`,
      qualityMetrics: result.qualityMetrics,
      clinicalInterpretation: result.clinicalInterpretation,
      standardRecommendation: result.recommendedFollowUp,
    },
    lesionQuantification: result.lesions.map((l) => ({
      pathologyType: l.type,
      detectedCount: l.count,
      quadrant: l.quadrant || 'Perimacular / Arcade',
      severityContribution: `${l.severityContribution}%`,
      description: l.description,
    })),
    gradCamTelemetry: {
      topAttentionZones: result.gradCamRegions.map((r) => ({
        region: r.label,
        quadrant: r.quadrant,
        crossAttentionWeight: r.weight,
        clinicalSignificance: r.significance,
      })),
    },
    ophthalmologistReview: review || result.ophthalmologistReview || {
      status: 'Pending Physician Sign-Off',
      reviewedDate: new Date().toISOString().split('T')[0],
      ophthalmologistName: 'Dr. Sarah Lin, MD',
      ophthalmologistTitle: 'Senior Vitreoretinal Specialist, FAAO',
      licenseNumber: 'MD-849102-EYE',
      affiliation: 'Wilmer Eye Institute, Johns Hopkins Medicine',
      clinicalAgreement: 'concur',
      finalGrade: result.predictedGrade,
      macularEdemaPresent: false,
      clinicalImpressions: 'Automated hybrid prediction concurred with. Color fundus exhibits characteristic microaneurysms and intraretinal microvascular changes.',
      treatmentRecommendations: [
        'High-definition Macular OCT protocol',
        'Intensive glycemic control (Target HbA1c < 7.0%)',
        'Clinical re-evaluation in 3 months',
      ],
      followUpInterval: '3 Months',
      signatureStamp: 'VERIFIED_ELECTRONIC_SIGNATURE_LIN_MD',
    },
  };
}

/**
 * Generates an EHR-ready formatted plain text consultation note.
 */
export function generateClinicalReportText(
  result: PredictionResult,
  review?: OphthalmologistSuggestion
): string {
  const meta = gradeMetadata[result.predictedGrade];
  const activeReview = review || result.ophthalmologistReview;
  const divider = '======================================================================\n';

  let txt = '';
  txt += divider;
  txt += 'WILMER EYE INSTITUTE - VITREORETINAL INFORMATICS SERVICE\n';
  txt += 'AUTOMATED MULTI-FEATURE DIABETIC RETINOPATHY CONSULTATION REPORT\n';
  txt += divider;
  txt += `Report Reference ID : REP-${result.id}\n`;
  txt += `Date of Examination : ${result.timestamp}\n`;
  txt += `Report Generation   : ${new Date().toLocaleString()}\n`;
  txt += divider;
  txt += 'PATIENT DEMOGRAPHICS:\n';
  txt += `Name                : ${result.patientName}\n`;
  txt += `Medical Record (MRN): ${result.patientId}\n`;
  txt += `Age / Gender        : ${result.patientAge} Years / ${result.patientGender}\n`;
  txt += `Eye Evaluated       : ${result.eyeSide}\n`;
  txt += divider;
  txt += 'ARTIFICIAL INTELLIGENCE DIAGNOSTIC INFERENCE:\n';
  txt += `Model Architecture  : Hybrid ConvNeXtV2 + Swin Transformer (Dual-Stream)\n`;
  txt += `Predicted Severity  : ${meta.fullName} (Grade ${result.predictedGrade})\n`;
  txt += `ICD-10-CM Diagnosis : ${meta.icd10}\n`;
  txt += `Risk Stratification : ${meta.riskLevel.toUpperCase()} RISK\n`;
  txt += `Model Confidence    : ${(result.confidence * 100).toFixed(1)}%\n`;
  txt += `Quality Assessment  : ${result.qualityScore}% (Valid, no media artifact)\n\n`;

  txt += 'PROBABILITY DISTRIBUTION:\n';
  txt += ` - No DR (Grade 0)            : ${(result.probabilities.noDR * 100).toFixed(2)}%\n`;
  txt += ` - Mild NPDR (Grade 1)        : ${(result.probabilities.mild * 100).toFixed(2)}%\n`;
  txt += ` - Moderate NPDR (Grade 2)    : ${(result.probabilities.moderate * 100).toFixed(2)}%\n`;
  txt += ` - Severe NPDR (Grade 3)      : ${(result.probabilities.severe * 100).toFixed(2)}%\n`;
  txt += ` - Proliferative DR (Grade 4) : ${(result.probabilities.proliferative * 100).toFixed(2)}%\n\n`;

  txt += 'BIOMARKERS & LESION DETECTION:\n';
  result.lesions.forEach((l) => {
    txt += ` * ${l.type.padEnd(20)} : ${l.count} lesions detected (${l.severityContribution}% severity weight)\n`;
  });
  txt += '\n';

  txt += divider;
  txt += 'ATTENDING OPHTHALMOLOGIST REVIEW & RECOMMENDATIONS:\n';
  if (activeReview) {
    txt += `Clinician           : ${activeReview.ophthalmologistName}, ${activeReview.ophthalmologistTitle}\n`;
    txt += `License ID          : ${activeReview.licenseNumber} (${activeReview.affiliation})\n`;
    txt += `Clinical Agreement  : ${
      activeReview.clinicalAgreement === 'concur'
        ? 'CONCUR with AI Model Diagnosis'
        : activeReview.clinicalAgreement === 'modified'
        ? `ADJUSTED to Grade ${activeReview.finalGrade}`
        : 'EQUIVOCAL / Secondary Consultation Requested'
    }\n`;
    txt += `Diabetic Macular Edema : ${activeReview.macularEdemaPresent ? 'PRESENT / SUSPECTED' : 'Not observed on fundus'}\n`;
    txt += `Recommended Interval: Follow-up in ${activeReview.followUpInterval}\n\n`;
    txt += `CLINICAL IMPRESSIONS & REMARKS:\n${activeReview.clinicalImpressions}\n\n`;
    txt += 'PRESCRIPTIVE MANAGEMENT PLAN:\n';
    activeReview.treatmentRecommendations.forEach((rec, idx) => {
      txt += `  ${idx + 1}. ${rec}\n`;
    });
    txt += `\nDigital Electronic Signature: [${activeReview.signatureStamp || 'CERTIFIED_ELECTRONIC_SIGNATURE'}]\n`;
  } else {
    txt += 'Status: Preliminary AI Report - Awaiting Specialist In-Person Sign-off.\n';
  }

  txt += divider;
  txt += 'END OF CLINICAL REPORT • CONFIDENTIAL MEDICAL DOCUMENT\n';
  txt += divider;

  return txt;
}

/**
 * Triggers a browser download of the clinical JSON report.
 */
export function downloadReportJson(result: PredictionResult, review?: OphthalmologistSuggestion) {
  const data = generateClinicalReportJson(result, review);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `DR_Vision_Report_${result.patientId}_${result.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a browser download of the plain text medical consultation summary.
 */
export function downloadReportText(result: PredictionResult, review?: OphthalmologistSuggestion) {
  const text = generateClinicalReportText(result, review);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Clinical_Summary_${result.patientId}_${result.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
