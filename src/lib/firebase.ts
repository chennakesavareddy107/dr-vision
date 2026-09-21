import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PatientRecord, PredictionResult, AuditLogItem, ClinicianUser } from '../types';
import { samplePatients, samplePredictions, auditLogs } from '../data/mockData';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore with specific databaseId from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ==========================================
// Authentication Functions
// ==========================================

export async function loginWithEmail(email: string, pass: string): Promise<ClinicianUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const user = cred.user;
  
  // Fetch profile from Firestore or construct
  let profile = await fetchClinicianProfile(user.uid);
  if (!profile) {
    profile = {
      uid: user.uid,
      name: user.displayName || email.split('@')[0] || 'Clinician',
      email: user.email || email,
      role: 'Attending Ophthalmologist',
      affiliation: 'Wilmer Eye Institute',
    };
    await setClinicianProfile(profile);
  }

  await recordAudit(
    'USER_LOGIN',
    `User: ${profile.name}`,
    'Success',
    `Authenticated via institutional email (${profile.email}).`,
    profile.name,
    user.uid
  );

  return profile;
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string,
  role: string = 'Attending Ophthalmologist',
  affiliation: string = 'Wilmer Eye Institute',
  licenseNumber: string = 'MD-CLINICAL'
): Promise<ClinicianUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  const user = cred.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  const profile: ClinicianUser = {
    uid: user.uid,
    name: displayName || email.split('@')[0],
    email: user.email || email,
    role,
    affiliation,
    licenseNumber,
  };

  await setClinicianProfile(profile);

  await recordAudit(
    'ACCOUNT_REGISTERED',
    `User: ${profile.name}`,
    'Success',
    `Registered clinical credentials with role ${role}.`,
    profile.name,
    user.uid
  );

  return profile;
}

export async function loginWithGoogle(): Promise<ClinicianUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;

  let profile = await fetchClinicianProfile(user.uid);
  if (!profile) {
    profile = {
      uid: user.uid,
      name: user.displayName || 'Dr. Google Clinician',
      email: user.email || '',
      role: 'Senior Retinal Specialist',
      affiliation: 'Wilmer Eye Institute, Johns Hopkins Medicine',
      photoURL: user.photoURL || undefined,
    };
    await setClinicianProfile(profile);
  }

  await recordAudit(
    'USER_LOGIN_GOOGLE',
    `User: ${profile.name}`,
    'Success',
    `Single Sign-On verified via Google Identity Provider.`,
    profile.name,
    user.uid
  );

  return profile;
}

export async function loginAsGuestClinician(demoRole = 'Senior Retinal Specialist'): Promise<ClinicianUser> {
  const cred = await signInAnonymously(auth);
  const user = cred.user;

  const profile: ClinicianUser = {
    uid: user.uid,
    name: 'Dr. Sarah Lin, MD (Demo)',
    email: 'sarah.lin@wilmer.jhu.edu',
    role: demoRole,
    affiliation: 'Wilmer Eye Institute',
    licenseNumber: 'MD-849102-EYE',
    isAnonymous: true,
  };

  await setClinicianProfile(profile);
  return profile;
}

export async function logoutUser(): Promise<void> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await recordAudit(
      'USER_LOGOUT',
      `User: ${currentUser.email || currentUser.uid}`,
      'Success',
      'Clinical session ended securely.',
      currentUser.displayName || 'Clinician',
      currentUser.uid
    );
  }
  await signOut(auth);
}

export async function sendResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function fetchClinicianProfile(uid: string): Promise<ClinicianUser | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as ClinicianUser;
    }
  } catch (e) {
    console.warn('Could not fetch user profile from Firestore:', e);
  }
  return null;
}

export async function setClinicianProfile(profile: ClinicianUser): Promise<void> {
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn('Could not persist clinician profile:', e);
  }
}

// ==========================================
// Patient Records Firestore API
// ==========================================

export function subscribeToPatients(
  onUpdate: (patients: PatientRecord[]) => void,
  onError?: (err: Error) => void
) {
  const patientsRef = collection(db, 'patients');

  return onSnapshot(
    patientsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // First-time database initialization: seed sample cohort
        try {
          await seedInitialPatients();
        } catch (e) {
          console.warn('Seed patients error:', e);
          onUpdate(samplePatients);
        }
        return;
      }

      const list: PatientRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as PatientRecord);
      });

      // Sort by last exam date descending
      list.sort((a, b) => new Date(b.lastExamDate || 0).getTime() - new Date(a.lastExamDate || 0).getTime());
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to patients collection:', error);
      if (onError) onError(error);
      // Fallback to local sample data
      onUpdate(samplePatients);
    }
  );
}

export async function seedInitialPatients(): Promise<void> {
  for (const patient of samplePatients) {
    try {
      await setDoc(doc(db, 'patients', patient.id), {
        ...patient,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not seed patient:', patient.id, err);
    }
  }
}

export async function savePatientRecord(patient: PatientRecord, clinicianUid?: string): Promise<string> {
  const patientId = patient.id || `PT-${Math.floor(10000 + Math.random() * 90000)}`;
  const ref = doc(db, 'patients', patientId);

  const data = {
    ...patient,
    id: patientId,
    createdBy: clinicianUid || auth.currentUser?.uid || 'system',
    updatedAt: new Date().toISOString(),
    createdAt: patient.lastExamDate ? new Date(patient.lastExamDate).toISOString() : new Date().toISOString(),
  };

  await setDoc(ref, data, { merge: true });

  await recordAudit(
    'PATIENT_RECORD_SAVED',
    `Patient: ${patient.name} (${patient.mrn})`,
    'Success',
    `Patient clinical record saved with Grade ${patient.currentGrade} DR classification.`,
    auth.currentUser?.displayName || 'Attending Clinician',
    clinicianUid || auth.currentUser?.uid
  );

  return patientId;
}

export async function updatePatientRecord(
  patientId: string,
  updates: Partial<PatientRecord>
): Promise<void> {
  const ref = doc(db, 'patients', patientId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePatientRecord(patientId: string, patientName?: string): Promise<void> {
  await deleteDoc(doc(db, 'patients', patientId));
  await recordAudit(
    'PATIENT_RECORD_DELETED',
    `Patient ID: ${patientId}`,
    'Warning',
    `Clinical chart for ${patientName || patientId} archived/deleted from active registry.`,
    auth.currentUser?.displayName || 'Attending Clinician',
    auth.currentUser?.uid
  );
}

// ==========================================
// Predictions & Retinal Scans Firestore API
// ==========================================

export function subscribeToPredictions(
  onUpdate: (preds: PredictionResult[]) => void,
  onError?: (err: Error) => void
) {
  const predsRef = collection(db, 'predictions');

  return onSnapshot(
    predsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          await seedInitialPredictions();
        } catch (e) {
          console.warn('Seed predictions error:', e);
          onUpdate(samplePredictions);
        }
        return;
      }

      const list: PredictionResult[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as PredictionResult);
      });

      // Sort by timestamp descending
      list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to predictions collection:', error);
      if (onError) onError(error);
      onUpdate(samplePredictions);
    }
  );
}

export async function seedInitialPredictions(): Promise<void> {
  for (const pred of samplePredictions) {
    try {
      await setDoc(doc(db, 'predictions', pred.id), {
        ...pred,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not seed prediction:', pred.id, e);
    }
  }
}

export async function savePredictionResult(
  result: PredictionResult,
  clinicianUid?: string
): Promise<string> {
  const predId = result.id || `PRED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const ref = doc(db, 'predictions', predId);

  const data = {
    ...result,
    id: predId,
    createdBy: clinicianUid || auth.currentUser?.uid || 'system',
    createdAt: new Date().toISOString(),
  };

  await setDoc(ref, data, { merge: true });

  await recordAudit(
    'PREDICTION_SAVED',
    `Scan ID: ${predId}`,
    'Success',
    `Retinal scan inference stored for ${result.patientName} (Grade ${result.predictedGrade}, ${(result.confidence * 100).toFixed(1)}% conf).`,
    auth.currentUser?.displayName || 'Attending Clinician',
    clinicianUid || auth.currentUser?.uid
  );

  return predId;
}

export async function updatePredictionReview(
  predId: string,
  updatedData: Partial<PredictionResult>
): Promise<void> {
  const ref = doc(db, 'predictions', predId);
  await updateDoc(ref, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });

  await recordAudit(
    'OPHTHALMOLOGIST_REVIEW_SUBMITTED',
    `Scan ID: ${predId}`,
    'Success',
    `Attending specialist stamped digital signature and updated clinical suggestions.`,
    auth.currentUser?.displayName || 'Attending Clinician',
    auth.currentUser?.uid
  );
}

// ==========================================
// Audit Logs Firestore API
// ==========================================

export async function recordAudit(
  action: string,
  resource: string,
  status: 'Success' | 'Warning' | 'Flagged',
  details: string,
  user: string = 'Attending Clinician',
  userId?: string
): Promise<void> {
  try {
    const logId = `AUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    await setDoc(doc(db, 'audit_logs', logId), {
      id: logId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      resource,
      status,
      details,
      user,
      userId: userId || auth.currentUser?.uid || 'anonymous',
    });
  } catch (e) {
    console.warn('Audit record warning:', e);
  }
}

export function subscribeToAuditLogs(onUpdate: (logs: AuditLogItem[]) => void) {
  const logsRef = collection(db, 'audit_logs');
  const q = query(logsRef, limit(50));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial audit trail
        for (const item of auditLogs) {
          try {
            await setDoc(doc(db, 'audit_logs', item.id), item);
          } catch (e) {
            // ignore
          }
        }
        onUpdate(auditLogs);
        return;
      }

      const list: AuditLogItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as AuditLogItem);
      });

      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onUpdate(list);
    },
    (err) => {
      console.warn('Audit log subscription error:', err);
      onUpdate(auditLogs);
    }
  );
}
