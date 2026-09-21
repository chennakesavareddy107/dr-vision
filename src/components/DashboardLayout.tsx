import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  LayoutGrid,
  Users,
  UploadCloud,
  CheckCircle,
  Sparkles,
  Search,
  LineChart,
  Database,
  FileText,
  Home,
  Bot,
  ShieldCheck,
  UserCheck,
  LogOut,
  Bell,
  ArrowLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Activity,
  Maximize2,
} from 'lucide-react';

export type DashboardTab =
  | 'dashboard'
  | 'patients'
  | 'upload'
  | 'diagnostic'
  | 'grad-cam'
  | 'lesions'
  | 'analytics'
  | 'reports'
  | 'platform'
  | 'copilot'
  | 'admin'
  | 'profile';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onReturnToLanding: () => void;
  currentUser: { name: string; email: string; role: string };
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onReturnToLanding,
  currentUser,
  onLogout,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const workflowNavItems = [
    { id: 'dashboard' as DashboardTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'patients' as DashboardTab, label: 'Patient Records (EPR)', icon: Users },
    { id: 'upload' as DashboardTab, label: 'Image Upload', icon: UploadCloud },
    { id: 'diagnostic' as DashboardTab, label: 'Diagnostic Results', icon: CheckCircle },
    { id: 'grad-cam' as DashboardTab, label: 'Grad-CAM Saliency', icon: Sparkles },
    { id: 'analytics' as DashboardTab, label: 'AI Analytics', icon: LineChart },
    { id: 'reports' as DashboardTab, label: 'Patient Reports', icon: FileText },
    { id: 'platform' as DashboardTab, label: 'Platform Overview', icon: Home },
    { id: 'copilot' as DashboardTab, label: 'AI Copilot', icon: Bot },
  ];

  const governanceNavItems = [
    { id: 'admin' as DashboardTab, label: 'Admin & Audits', icon: ShieldCheck },
    { id: 'profile' as DashboardTab, label: 'Account Profile', icon: UserCheck },
  ];

  const currentNav = [...workflowNavItems, ...governanceNavItems].find((i) => i.id === currentTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-[#0F172A]" id="dashboard-layout-root">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <BrandLogo size="sm" onClick={onReturnToLanding} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar matching Reference Image 2 */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        id="dashboard-sidebar"
      >
        {/* Sidebar Header with Brand */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <BrandLogo size="sm" onClick={onReturnToLanding} />
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          
          {/* Group 1: Diagnostic Workflow */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2 font-mono">
              Diagnostic Workflow
            </div>
            <nav className="space-y-1">
              {workflowNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    id={`sidebar-tab-${item.id}`}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-teal-50/80 text-teal-900 border border-teal-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 2: Governance */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2 font-mono">
              Governance
            </div>
            <nav className="space-y-1">
              {governanceNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    id={`sidebar-tab-${item.id}`}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-teal-50/80 text-teal-900 border border-teal-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Sidebar Bottom: Return to Landing + Doctor Profile Card */}
        <div className="p-4 border-t border-slate-200/80 space-y-3 bg-slate-50/70">
          
          <button
            onClick={onReturnToLanding}
            id="sidebar-landing-btn"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-[#0B1B3B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing Page</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Clinician Profile */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#0B1B3B] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentUser.role}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
          
          {/* Breadcrumbs & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>DR Vision</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{currentNav?.label || 'Workspace'}</span>
            </div>
          </div>

          {/* Action Controls & Notifications */}
          <div className="flex items-center gap-3">

            {/* Quick Upload action */}
            <button
              onClick={() => onSelectTab('upload')}
              id="topbar-new-upload-btn"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 bg-[#0B1B3B] hover:bg-[#13274F] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>New Fundus</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                id="topbar-notifications-btn"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Clinical Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs animate-in fade-in">
                  <div className="font-bold text-[#0B1B3B] mb-2 flex items-center justify-between">
                    <span>Clinical Notifications</span>
                    <span className="text-[10px] text-teal-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
                      <div className="font-semibold">Urgent PDR Detected</div>
                      <div className="text-[11px] text-rose-700">Patient Sofia Reyes (PT-10114) exhibits active optic disc neovascularization.</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 text-blue-800">
                      <div className="font-semibold">Daily QA Calibration Complete</div>
                      <div className="text-[11px] text-blue-700">Daily validation batch across 250 images passed with AUC 0.991.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic View Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
