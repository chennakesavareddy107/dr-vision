import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  loginWithGoogle as fbLoginWithGoogle,
  loginAsGuestClinician as fbLoginAsGuest,
  logoutUser as fbLogoutUser,
  sendResetPassword as fbSendResetPassword,
  fetchClinicianProfile,
  subscribeToPatients,
  savePatientRecord,
  updatePatientRecord,
  deletePatientRecord,
  subscribeToPredictions,
  savePredictionResult,
  updatePredictionReview,
  subscribeToAuditLogs,
  recordAudit,
} from '../lib/firebase';
import { ClinicianUser, PatientRecord, PredictionResult, AuditLogItem } from '../types';
import { samplePatients, samplePredictions, auditLogs as initialAuditLogs } from '../data/mockData';

interface FirebaseContextValue {
  user: ClinicianUser | null;
  clinicianUser: ClinicianUser | null;
  firebaseUser: FirebaseUser | null;
  loadingAuth: boolean;
  patients: PatientRecord[];
  predictions: PredictionResult[];
  auditLogsList: AuditLogItem[];
  auditLogs: AuditLogItem[];
  isConnectedToFirebase: boolean;
  
  // Auth methods
  signInWithEmail: (email: string, pass: string) => Promise<ClinicianUser>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name: string,
    role?: string,
    affiliation?: string,
    license?: string
  ) => Promise<ClinicianUser>;
  signInWithGoogle: () => Promise<ClinicianUser>;
  signInAsGuest: (demoRole?: string) => Promise<ClinicianUser>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  
  // Patient CRUD
  addPatient: (patient: PatientRecord) => Promise<string>;
  editPatient: (id: string, updates: Partial<PatientRecord>) => Promise<void>;
  removePatient: (id: string, name?: string) => Promise<void>;
  
  // Prediction storage
  storePrediction: (pred: PredictionResult) => Promise<string>;
  modifyPrediction: (id: string, updates: Partial<PredictionResult>) => Promise<void>;
  
  // Audit logs
  createAuditLog: (
    action: string,
    resource: string,
    status: 'Success' | 'Warning' | 'Flagged',
    details: string
  ) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<ClinicianUser | null>(() => {
    const saved = localStorage.getItem('dr_vision_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      uid: 'demo-sarah-lin',
      name: 'Dr. Sarah Lin, MD',
      email: 'sarah.lin@wilmer.jhu.edu',
      role: 'Senior Retinal Specialist',
      affiliation: 'Wilmer Eye Institute, Johns Hopkins Medicine',
      licenseNumber: 'MD-849102-EYE',
    };
  });
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [patients, setPatients] = useState<PatientRecord[]>(samplePatients);
  const [predictions, setPredictions] = useState<PredictionResult[]>(samplePredictions);
  const [auditLogsList, setAuditLogsList] = useState<AuditLogItem[]>(initialAuditLogs);
  const [isConnectedToFirebase, setIsConnectedToFirebase] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const profile = await fetchClinicianProfile(fbUser.uid);
          if (profile) {
            setUser(profile);
            localStorage.setItem('dr_vision_user', JSON.stringify(profile));
          } else {
            const fallbackProfile: ClinicianUser = {
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Clinician',
              email: fbUser.email || '',
              role: 'Attending Ophthalmologist',
              affiliation: 'Wilmer Eye Institute',
              photoURL: fbUser.photoURL || undefined,
            };
            setUser(fallbackProfile);
            localStorage.setItem('dr_vision_user', JSON.stringify(fallbackProfile));
          }
        } catch (e) {
          console.error('Error restoring profile from Firestore:', e);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Patients in Firestore
  useEffect(() => {
    const unsubPatients = subscribeToPatients(
      (list) => {
        if (list && list.length > 0) {
          setPatients(list);
          setIsConnectedToFirebase(true);
        }
      },
      (err) => {
        console.warn('Patients subscription error, using local fallback:', err);
      }
    );

    return () => unsubPatients();
  }, []);

  // Listen to Predictions in Firestore
  useEffect(() => {
    const unsubPreds = subscribeToPredictions(
      (list) => {
        if (list && list.length > 0) {
          setPredictions(list);
        }
      },
      (err) => {
        console.warn('Predictions subscription error, using local fallback:', err);
      }
    );

    return () => unsubPreds();
  }, []);

  // Listen to Audit logs in Firestore
  useEffect(() => {
    const unsubLogs = subscribeToAuditLogs((logs) => {
      if (logs && logs.length > 0) {
        setAuditLogsList(logs);
      }
    });

    return () => unsubLogs();
  }, []);

  // Auth Handlers
  const signInWithEmail = async (email: string, pass: string): Promise<ClinicianUser> => {
    const profile = await fbLoginWithEmail(email, pass);
    setUser(profile);
    localStorage.setItem('dr_vision_user', JSON.stringify(profile));
    return profile;
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    role = 'Attending Ophthalmologist',
    affiliation = 'Wilmer Eye Institute',
    license = 'MD-CLINICAL'
  ): Promise<ClinicianUser> => {
    const profile = await fbRegisterWithEmail(email, pass, name, role, affiliation, license);
    setUser(profile);
    localStorage.setItem('dr_vision_user', JSON.stringify(profile));
    return profile;
  };

  const signInWithGoogle = async (): Promise<ClinicianUser> => {
    const profile = await fbLoginWithGoogle();
    setUser(profile);
    localStorage.setItem('dr_vision_user', JSON.stringify(profile));
    return profile;
  };

  const signInAsGuest = async (demoRole = 'Senior Retinal Specialist'): Promise<ClinicianUser> => {
    const profile = await fbLoginAsGuest(demoRole);
    setUser(profile);
    localStorage.setItem('dr_vision_user', JSON.stringify(profile));
    return profile;
  };

  const signOut = async (): Promise<void> => {
    await fbLogoutUser();
    setUser(null);
    localStorage.removeItem('dr_vision_user');
  };

  const resetPassword = async (email: string): Promise<void> => {
    await fbSendResetPassword(email);
  };

  // Patients Handlers
  const addPatient = async (patient: PatientRecord): Promise<string> => {
    const newId = await savePatientRecord(patient, user?.uid);
    // Optimistic local update
    setPatients((prev) => {
      const exists = prev.some((p) => p.id === newId);
      if (exists) {
        return prev.map((p) => (p.id === newId ? { ...patient, id: newId } : p));
      }
      return [{ ...patient, id: newId }, ...prev];
    });
    return newId;
  };

  const editPatient = async (id: string, updates: Partial<PatientRecord>): Promise<void> => {
    await updatePatientRecord(id, updates);
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removePatient = async (id: string, name?: string): Promise<void> => {
    await deletePatientRecord(id, name);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // Predictions Handlers
  const storePrediction = async (pred: PredictionResult): Promise<string> => {
    const newId = await savePredictionResult(pred, user?.uid);
    setPredictions((prev) => [{ ...pred, id: newId }, ...prev]);
    return newId;
  };

  const modifyPrediction = async (id: string, updates: Partial<PredictionResult>): Promise<void> => {
    await updatePredictionReview(id, updates);
    setPredictions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Audit Logs
  const createAuditLog = async (
    action: string,
    resource: string,
    status: 'Success' | 'Warning' | 'Flagged',
    details: string
  ): Promise<void> => {
    await recordAudit(action, resource, status, details, user?.name || 'Clinician', user?.uid);
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        clinicianUser: user,
        firebaseUser,
        loadingAuth,
        patients,
        predictions,
        auditLogsList,
        auditLogs: auditLogsList,
        isConnectedToFirebase,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        logout: signOut,
        resetPassword,
        addPatient,
        editPatient,
        removePatient,
        storePrediction,
        modifyPrediction,
        createAuditLog,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
