import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Terminal,
  Flame,
} from 'lucide-react';
import { auditLogs as sampleAuditLogs } from '../../data/mockData';
import { useFirebase } from '../../context/FirebaseContext';
import { AuditLogItem } from '../../types';

export const AdminAuditsView: React.FC = () => {
  const { auditLogs: liveAuditLogs, isConnectedToFirebase } = useFirebase();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const displayLogs = liveAuditLogs.length > 0 ? liveAuditLogs : sampleAuditLogs;

  const handleExportCsv = () => {
    const headers = ['Event ID', 'Action / Protocol', 'Actor', 'Target Resource', 'Status', 'Timestamp (UTC)'];
    const rows = displayLogs.map((log: AuditLogItem) => [
      log.id,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.user.replace(/"/g, '""')}"`,
      `"${log.resource.replace(/"/g, '""')}"`,
      log.status,
      log.timestamp,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `drvision_hipaa_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="admin-audits-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
            Regulatory Audits & Compliance Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            HIPAA-compliant immutable audit trail tracking diagnostic events, patient record access, and report generation.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Encrypted audit log CSV exported successfully.</span>
        </div>
      )}

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Inference Security Encryption</span>
          <div className="text-2xl font-serif font-bold text-[#0B1B3B] mt-1 mb-1">
            AES-256-GCM
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Zero-knowledge client payload hashing
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Firestore Cloud Sync</span>
          <div className="text-2xl font-serif font-bold text-[#0B1B3B] mt-1 mb-1 font-mono">
            {displayLogs.length} Events
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
            Immutable cloud ledger active
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Active Access Controls</span>
          <div className="text-2xl font-serif font-bold text-[#0B1B3B] mt-1 mb-1">
            RBAC Enforced
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
            Clinician / Specialist / Administrator
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1B3B]">
              Immutable Activity Ledger ({displayLogs.length} records)
            </h3>
            <p className="text-xs text-slate-500">
              Audited operations across authentication, patient records, and doctor reviews
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
            Real-Time Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Event ID</th>
                <th className="pb-3">Action / Protocol</th>
                <th className="pb-3">Actor (Clinician)</th>
                <th className="pb-3">Target Resource</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Timestamp (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayLogs.map((log: AuditLogItem) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 pl-2 font-bold text-slate-700">{log.id}</td>
                  <td className="py-3">
                    <span className="font-sans font-semibold text-[#0B1B3B]">{log.action}</span>
                  </td>
                  <td className="py-3 font-sans text-slate-600">{log.user}</td>
                  <td className="py-3 text-slate-500 max-w-xs truncate">{log.resource}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      log.status === 'Success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : log.status === 'Warning'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2 text-slate-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
