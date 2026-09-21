import React from 'react';
import {
  Users,
  Shield,
  Award,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap
} from 'lucide-react';
import { SitePage } from '../types';

interface AboutPageProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  const leadership = [
    {
      name: 'Dr. Radhika Mehta, MD, PhD',
      role: 'Chief Medical Officer & Co-Founder',
      affiliation: 'Consultant Vitreoretinal Surgeon, Former Wilmer Eye Institute Fellow',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Prof. Alistair Thorne, PhD',
      role: 'Head of AI Research & Architecture',
      affiliation: 'Reader in Medical Computer Vision, 15+ years in Convolutional Neural Networks',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Elena Rostova, MD',
      role: 'Director of Clinical Validation',
      affiliation: 'Senior Ophthalmologist, European Society of Retina Specialists (EURETINA)',
      image: 'https://images.unsplash.com/photo-1594824813512-9c323f4b2326?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Marcus Lin, PhD',
      role: 'Lead Deep Learning Engineer',
      affiliation: 'Vision Transformer specialist, Pioneer in Swin & ConvNeXt hybrid backbones',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] py-10" id="about-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold tracking-[0.25em] text-blue-600 uppercase font-mono">
              ABOUT DR VISION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B1B3B] mb-3">
            Eradicating Preventable Blindness
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            DR Vision unites vitreoretinal surgeons, clinical researchers, and deep learning scientists to build transparent, clinically-grounded artificial intelligence for diabetic eye care.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To democratize early, accurate diabetic retinopathy grading globally, ensuring that no patient loses their vision simply due to lack of specialist screening access.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Explainability First</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Black-box AI has no place in clinical medicine. Every prediction from DR Vision is accompanied by Grad-CAM attention maps, lesion localization, and confidence distributions.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Clinical Rigor</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Trained and cross-validated on multi-camera, multi-ethnic datasets under the guidance of board-certified retina specialists and aligned with ICDR standards.
              </p>
            </div>
          </div>
        </div>

        {/* Research Leadership Team */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B] mb-2">
              Scientific Leadership & Clinical Advisory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Developed in collaborative partnership between leading ophthalmology departments and deep learning laboratories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-center flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-slate-100 shadow-sm"
                />
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">{member.name}</h3>
                <div className="text-xs font-semibold text-blue-600 mb-2">{member.role}</div>
                <p className="text-[11px] text-slate-500 leading-normal">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Collaborations */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              CLINICAL EVALUATION PARTNERS
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-400 mb-1" />
              <div className="text-xs font-bold text-slate-800">Wilmer Eye Institute</div>
              <div className="text-[10px] text-slate-500">Retinal Imaging Lab</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-400 mb-1" />
              <div className="text-xs font-bold text-slate-800">Moorfields Eye Hospital</div>
              <div className="text-[10px] text-slate-500">Tele-ophthalmology Trial</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <GraduationCap className="w-6 h-6 text-slate-400 mb-1" />
              <div className="text-xs font-bold text-slate-800">Stanford AI in Medicine</div>
              <div className="text-[10px] text-slate-500">Validation Consortium</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-400 mb-1" />
              <div className="text-xs font-bold text-slate-800">Sankara Nethralaya</div>
              <div className="text-[10px] text-slate-500">Rural Diabetic Screening</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
