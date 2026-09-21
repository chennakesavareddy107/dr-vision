import React, { useState, useEffect } from 'react';
import { SitePage, PredictionResult, DRGrade } from './types';
import { samplePredictions } from './data/mockData';

// Multi-Page Components
import { UnifiedNavbar } from './components/navigation/UnifiedNavbar';
import { UnifiedFooter } from './components/navigation/UnifiedFooter';
import { HomePage } from './pages/HomePage';
import { PredictionPage } from './pages/PredictionPage';
import { GradCamPage } from './pages/GradCamPage';
import { PerformancePage } from './pages/PerformancePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Clinical Workspace & Dashboard
import { DashboardLayout, DashboardTab } from './components/DashboardLayout';
import { AuthModal } from './components/AuthModal';
import { useFirebase } from './context/FirebaseContext';
import { MainDashboard } from './components/dashboard/MainDashboard';

import { ImageUploadView } from './components/dashboard/ImageUploadView';
import { DiagnosticResultsView } from './components/dashboard/DiagnosticResultsView';
import { GradCamView } from './components/dashboard/GradCamView';
import { LesionAnalysisView } from './components/dashboard/LesionAnalysisView';
import { AIAnalyticsView } from './components/dashboard/AIAnalyticsView';
import { PatientRecordsView } from './components/dashboard/PatientRecordsView';
import { PatientReportsView } from './components/dashboard/PatientReportsView';
import { PlatformOverviewView } from './components/dashboard/PlatformOverviewView';
import { AICopilotView } from './components/dashboard/AICopilotView';
import { AdminAuditsView } from './components/dashboard/AdminAuditsView';
import { AccountProfileView } from './components/dashboard/AccountProfileView';

export default function App() {
  // Multipage routing state
  const [currentPage, setCurrentPage] = useState<SitePage | 'workspace'>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['home', 'prediction', 'grad-cam', 'performance', 'about', 'contact', 'workspace'].includes(hash)) {
      return hash as SitePage | 'workspace';
    }
    return 'home';
  });

  const [currentTab, setCurrentTab] = useState<DashboardTab>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { clinicianUser, logout } = useFirebase();

  // Active user session
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string }>(() => {
    const saved = localStorage.getItem('dr_vision_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Dr. Sarah Lin, MD',
      email: 'sarah.lin@wilmer.jhu.edu',
      role: 'Senior Retinal Specialist',
    };
  });

  // Keep currentUser synced with Firebase Auth clinicianUser
  useEffect(() => {
    if (clinicianUser) {
      setCurrentUser({
        name: clinicianUser.name || 'Dr. Sarah Lin, MD',
        email: clinicianUser.email || 'clinician@hospital.org',
        role: clinicianUser.role || 'Senior Retinal Specialist',
      });
    }
  }, [clinicianUser]);

  // Current active prediction for detailed clinical inspection
  const [activePrediction, setActivePrediction] = useState<PredictionResult>(samplePredictions[0]);

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'prediction', 'grad-cam', 'performance', 'about', 'contact', 'workspace'].includes(hash)) {
        setCurrentPage(hash as SitePage | 'workspace');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: SitePage | 'workspace') => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLaunchDemo = () => {
    setCurrentPage('workspace');
    setCurrentTab('dashboard');
    window.location.hash = '#/workspace';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectPrediction = (prediction: PredictionResult) => {
    setActivePrediction(prediction);
    setCurrentTab('diagnostic');
  };

  const handleDiagnosisComplete = (newResult: PredictionResult) => {
    setActivePrediction(newResult);
    setCurrentTab('diagnostic');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('dr_vision_user');
    setCurrentUser({
      name: 'Guest Clinician',
      email: 'clinician@hospital.med',
      role: 'Ophthalmic Observer',
    });
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      
      {/* If in website view (Home, Prediction, Grad-CAM, Performance, About, Contact) */}
      {currentPage !== 'workspace' && (
        <>
          {/* Top Unified Header with Active Tab Indicator */}
          <UnifiedNavbar
            currentPage={currentPage as SitePage}
            onNavigatePage={navigateToPage}
            onLaunchDemo={handleLaunchDemo}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          {/* Page Routing */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                onNavigatePage={navigateToPage}
                onLaunchDemo={handleLaunchDemo}
              />
            )}

            {currentPage === 'prediction' && (
              <PredictionPage
                onNavigatePage={navigateToPage}
                onLaunchDemo={handleLaunchDemo}
              />
            )}

            {currentPage === 'grad-cam' && (
              <GradCamPage
                onNavigatePage={navigateToPage}
                onLaunchDemo={handleLaunchDemo}
              />
            )}

            {currentPage === 'performance' && (
              <PerformancePage
                onNavigatePage={navigateToPage}
                onLaunchDemo={handleLaunchDemo}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigatePage={navigateToPage}
                onLaunchDemo={handleLaunchDemo}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                onNavigatePage={navigateToPage}
                onLaunchDemo={handleLaunchDemo}
              />
            )}
          </main>

          {/* Unified Footer */}
          <UnifiedFooter
            onNavigatePage={navigateToPage}
            onLaunchDemo={handleLaunchDemo}
          />
        </>
      )}

      {/* Clinical Workspace / Demo Dashboard View */}
      {currentPage === 'workspace' && (
        <DashboardLayout
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onReturnToLanding={() => navigateToPage('home')}
          currentUser={currentUser}
          onLogout={handleLogout}
        >
          {currentTab === 'dashboard' && (
            <MainDashboard
              onSelectPrediction={handleSelectPrediction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'patients' && (
            <PatientRecordsView
              onSelectPatient={() => {}}
              onDiagnosePatient={handleSelectPrediction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'upload' && (
            <ImageUploadView
              onDiagnosisComplete={handleDiagnosisComplete}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'diagnostic' && (
            <DiagnosticResultsView
              result={activePrediction}
              onNavigateTab={setCurrentTab}
              onOpenReport={() => setCurrentTab('reports')}
              onUpdatePrediction={setActivePrediction}
            />
          )}

          {currentTab === 'grad-cam' && (
            <GradCamView
              result={activePrediction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'lesions' && (
            <LesionAnalysisView
              result={activePrediction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'analytics' && (
            <AIAnalyticsView />
          )}

          {currentTab === 'reports' && (
            <PatientReportsView
              result={activePrediction}
              currentUser={currentUser}
              onNavigateTab={setCurrentTab}
              onUpdatePrediction={setActivePrediction}
            />
          )}

          {currentTab === 'platform' && (
            <PlatformOverviewView />
          )}

          {currentTab === 'copilot' && (
            <AICopilotView currentPrediction={activePrediction} />
          )}

          {currentTab === 'admin' && (
            <AdminAuditsView />
          )}

          {currentTab === 'profile' && (
            <AccountProfileView
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
            />
          )}
        </DashboardLayout>
      )}

      {/* Doctor & Researcher Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentPage('workspace');
        }}
      />

    </div>
  );
}
