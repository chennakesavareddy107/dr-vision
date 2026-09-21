import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building,
  ShieldCheck
} from 'lucide-react';
import { SitePage } from '../types';

interface ContactPageProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: 'Ophthalmologist',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does DR Vision achieve 96.3% confidence on Moderate DR?',
      a: 'DR Vision uses a dual-branch fusion pipeline. ConvNeXtV2 extracts fine microaneurysm and dot hemorrhage textures, while the Swin Transformer captures quadrant-wide lesion distributions. Cross-attention fuses these signals into high-confidence ICDR classifications.',
    },
    {
      q: 'What retinal fundus camera models are supported?',
      a: 'DR Vision is validated on major tabletop and portable fundus cameras including Topcon TRC-NW400, Zeiss Clarus, Canon CR-2, and smartphone-based adaptors (Volk iNview) across resolutions from 1024x1024 to 4K.',
    },
    {
      q: 'Can DR Vision be integrated into hospital EHR and PACS systems?',
      a: 'Yes. DR Vision supports DICOM C-STORE and FHIR API interoperability for seamless automatic ingestion from camera servers and export into Epic, Cerner, or local ophthalmic PACS.',
    },
    {
      q: 'Is this system certified for standalone autonomous diagnosis?',
      a: 'DR Vision is designed as an AI Clinical Decision Support (CDS) system for certified ophthalmologists, optometrists, and primary care physicians. It provides diagnostic assistance and should be reviewed by qualified clinicians.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] py-10" id="contact-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold tracking-[0.25em] text-blue-600 uppercase font-mono">
              GET IN TOUCH
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B1B3B] mb-3">
            Clinical Partnership & Inquiries
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Interested in deploying DR Vision for hospital screening, multi-center research, or dataset validation? Our clinical deployment team is ready to assist.
          </p>
        </div>

        {/* Contact Form & Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-serif font-bold text-[#0B1B3B] mb-1">
              Inquire for Clinical Deployment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Complete the form below to request pilot access, research weights, or an enterprise demonstration.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                  Thank you for reaching out. Our clinical integration team will review your institution’s requirements and respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-emerald-800 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Jordan Hayes"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="j.hayes@eyehospital.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institution / Hospital</label>
                    <input
                      type="text"
                      required
                      placeholder="Memorial Eye Center"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinical Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 cursor-pointer"
                    >
                      <option value="Ophthalmologist">Ophthalmologist / Retina Specialist</option>
                      <option value="Optometrist">Optometrist</option>
                      <option value="Clinic Director">Hospital / Clinic Director</option>
                      <option value="AI Researcher">Medical AI Researcher</option>
                      <option value="Other">Other Healthcare Professional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Collaboration Request / Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your clinic screening volume, camera hardware, or research interest..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0B1B3B] hover:bg-[#13274F] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Clinical Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Office & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-lg font-serif font-bold text-[#0B1B3B]">
                Research Hub & Headquarters
              </h3>

              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">DR Vision Research Initiative</div>
                  <div>1200 Innovation Way, Suite 400</div>
                  <div>Cambridge Biomedical Campus, MA 02142</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Direct Inquiries</div>
                  <div>clinical@drvision.org</div>
                  <div>research@drvision.org</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Clinical Desk</div>
                  <div>+1 (800) 492-EYES (3937)</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HIPAA, GDPR & ISO-13485 Research Protocols</span>
                </div>
              </div>
            </div>

            {/* Quick Test Drive Card */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6">
              <h4 className="text-sm font-bold text-blue-950 mb-1">Explore Prediction Live</h4>
              <p className="text-xs text-blue-800/80 mb-4">
                Test retinal image upload and view instant multi-feature predictions with Grad-CAM overlays.
              </p>
              <button
                onClick={() => onNavigatePage('prediction')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <span>Launch Prediction Page</span>
              </button>
            </div>
          </div>

        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#0B1B3B] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Answers regarding model architecture, clinical integration, and regulatory considerations.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-3.5 text-left font-semibold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      openFaq === idx ? 'transform rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
