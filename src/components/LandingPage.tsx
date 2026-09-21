import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Globe,
  Eye,
  TrendingUp,
  Layers,
  Zap,
  Users,
  Shield,
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  Target,
  Cpu,
  GitMerge,
  BarChart3,
  ShieldCheck,
  Heart,
  Linkedin,
  Github,
  Twitter,
  Youtube,
  CheckCircle2,
  Activity,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { samplePredictions, gradeMetadata } from '../data/mockData';
import { DRGrade, SitePage } from '../types';
import { BrandLogo } from './BrandLogo';
import { generateFundusSvg } from '../data/retinalAssets';
import clinicalEyeMacro from '../assets/images/clinical_eye_macro_1789908532837.jpg';
import familyEyesBright from '../assets/images/family_eyes_bright_1789908546740.jpg';

interface LandingPageProps {
  onStartDiagnosis: () => void;
  onNavigateDashboard: (tab?: string) => void;
  onSelectGradeDemo?: (grade: DRGrade) => void;
  onOpenAuth: () => void;
  currentUser?: { name: string; email: string; role: string };
  onNavigatePage?: (page: SitePage) => void;
  hideNavAndFooter?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDiagnosis,
  onNavigateDashboard,
  onSelectGradeDemo,
  onOpenAuth,
  onNavigatePage,
  hideNavAndFooter = false,
}) => {
  const [selectedResultGrade, setSelectedResultGrade] = useState<DRGrade>(2);
  const [heroViewMode, setHeroViewMode] = useState<'fundus' | 'gradcam' | 'overlay'>('overlay');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      quote:
        'DR Vision has the potential to significantly improve early detection and patient outcomes.',
      author: 'Dr. R. Mehta',
      role: 'Ophthalmologist',
      dept: 'AI Researcher',
      avatar:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'The dual-backbone ConvNeXtV2 and Swin approach balances local micro-lesion sensitivity with global vascular context.',
      author: 'Prof. Elena Rostova',
      role: 'Retinal Specialist',
      dept: 'Clinical AI Director',
      avatar:
        'https://images.unsplash.com/photo-1594824813512-9c323f4b2326?w=200&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'Immediate Grad-CAM visual heatmaps provide our ophthalmology team with transparent, explainable validation.',
      author: 'Dr. James Thorne',
      role: 'Vitreoretinal Surgeon',
      dept: 'Consultant',
      avatar:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden selection:bg-blue-100 selection:text-blue-900" id="landing-page-root">
      
      {/* ========================================================
          TOP NAVIGATION BAR (Exact Match to Image 2)
         ======================================================== */}
      {!hideNavAndFooter && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            
            {/* Logo on Left */}
            <div className="flex items-center">
              <BrandLogo size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
              <a
                href="#home"
                className="text-[#1D4ED8] font-semibold border-b-2 border-[#1D4ED8] pb-1 hover:text-blue-700 transition-colors"
              >
                Home
              </a>
              <a
                href="#prediction"
                onClick={(e) => {
                  if (onNavigatePage) {
                    e.preventDefault();
                    onNavigatePage('prediction');
                  }
                }}
                className="hover:text-[#0B1B3B] pb-1 transition-colors"
              >
                Prediction
              </a>
              <button
                onClick={() => onNavigateDashboard('grad-cam')}
                className="hover:text-[#0B1B3B] pb-1 transition-colors cursor-pointer"
              >
                Grad-CAM
              </button>
              <a
                href="#performance"
                onClick={(e) => {
                  if (onNavigatePage) {
                    e.preventDefault();
                    onNavigatePage('performance');
                  }
                }}
                className="hover:text-[#0B1B3B] pb-1 transition-colors"
              >
                Performance
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  if (onNavigatePage) {
                    e.preventDefault();
                    onNavigatePage('about');
                  }
                }}
                className="hover:text-[#0B1B3B] pb-1 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  if (onNavigatePage) {
                    e.preventDefault();
                    onNavigatePage('contact');
                  }
                }}
                className="hover:text-[#0B1B3B] pb-1 transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigateDashboard('patients')}
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
                title="Search Patient Records"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onStartDiagnosis}
                id="nav-start-diagnosis-cta"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer group"
              >
                <span>Start Diagnosis</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-blue-200" />
              </button>
            </div>

          </div>
        </header>
      )}

      {/* ========================================================
          1. HERO SECTION (Exact Match to Image 2)
         ======================================================== */}
      <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-[#F8FAFC]" id="home">
        {/* Subtle ambient clinical light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50/40 to-[#F8FAFC] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Typography & CTAs (Exact match to Image 2) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Monospace Kicker */}
              <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-slate-500 uppercase">
                NEXT-GENERATION RETINAL ANALYSIS
              </div>

              {/* Main Brand Title */}
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-[84px] font-bold text-[#0B1B3B] tracking-tight leading-[0.95]">
                DR Vision
              </h1>

              {/* Sub-headline */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#0B1B3B] leading-[1.2] pt-1">
                Intelligent Multi-feature Learning for Diabetic Retinopathy Grading
              </h2>

              {/* Body Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Empowering healthcare professionals with an advanced <strong className="font-semibold text-slate-800">Hybrid</strong> Deep Learning model (ConvNeXtV2 + Swin) for early and accurate detection and grading of Diabetic Retinopathy.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
                <button
                  onClick={onStartDiagnosis}
                  id="hero-start-diagnosis-cta"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer group"
                >
                  <span>Start Diagnosis</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  id="hero-watch-demo-cta"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-300 shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Social Proof / Trusted Row */}
              <div className="flex items-center gap-3.5 pt-3 select-none">
                <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                  <img
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Mehta"
                  />
                  <img
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1594824813512-9c323f4b2326?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Rostova"
                  />
                  <img
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Thorne"
                  />
                  <img
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Lin"
                  />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Trusted by researchers, clinicians and institutions worldwide.
                </p>
              </div>

            </div>

            {/* Right Column: Macro Eye + Reticle + Telemetry Card (Exact Match to Image 2) */}
            <div className="lg:col-span-6 relative flex flex-col items-center lg:items-end justify-center">
              
              {/* Macro Eye Frame */}
              <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-950">
                <img
                  src={clinicalEyeMacro}
                  alt="Ophthalmic Retinal Analysis"
                  className="w-full h-full object-cover object-center"
                />

                {/* Holographic Cyan Targeting Reticles Overlay */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full pointer-events-none text-cyan-400/80"
                  fill="none"
                >
                  <circle cx="230" cy="180" r="140" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 4" opacity="0.4" />
                  <circle cx="230" cy="180" r="100" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <circle cx="230" cy="180" r="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                  <circle cx="230" cy="180" r="28" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
                  <circle cx="230" cy="180" r="4" fill="currentColor" opacity="0.9" />
                  
                  {/* Crosshair ticks */}
                  <path d="M 230 30 L 230 50 M 230 310 L 230 330 M 80 180 L 100 180 M 360 180 L 380 180" stroke="currentColor" strokeWidth="1.5" />
                  
                  {/* Corner brackets */}
                  <path d="M 40 40 L 60 40 M 40 40 L 40 60" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                  <path d="M 360 40 L 340 40 M 360 40 L 360 60" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                </svg>

                {/* Top Right Vertical Keywords (DETECT, ANALYZE, GRADE, EMPOWER) */}
                <div className="absolute top-4 right-5 text-right font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-white/90 drop-shadow-md leading-relaxed select-none space-y-0.5">
                  <div>DETECT</div>
                  <div>ANALYZE</div>
                  <div>GRADE</div>
                  <div>EMPOWER</div>
                </div>

                {/* Cursive Tagline "For Healthier Eyes" */}
                <div className="absolute top-16 right-4 sm:right-6 text-white font-serif italic text-2xl sm:text-3xl drop-shadow-lg transform -rotate-6 select-none opacity-95">
                  For Healthier Eyes
                </div>

                {/* Subtle bottom vignette to ensure card readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Floating "Fundus Image Analysis" Card (Matching Image 2 exactly) */}
              <div className="w-full max-w-md bg-[#0B1B3B]/95 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-2xl mt-[-60px] sm:mt-[-70px] z-10 mx-auto lg:mr-4">
                <div className="text-xs text-slate-300 font-medium mb-3">
                  Fundus Image Analysis
                </div>

                <div className="grid grid-cols-12 gap-3.5 items-center">
                  {/* Left: Fundus Scan circular image */}
                  <div className="col-span-5 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-black border-2 border-amber-500 ring-4 ring-amber-500/20 shadow-lg relative group">
                      <img
                        src={samplePredictions[0].imageUrl}
                        alt="Fundus scan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right: Predicted Grade & Probability Breakdown */}
                  <div className="col-span-7 space-y-1.5 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-400">Predicted Grade</div>
                      <div className="text-base sm:text-lg font-bold text-amber-400 leading-tight">
                        Moderate DR
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        Confidence: 96%
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[96%]" />
                    </div>

                    {/* Class Softmax probabilities matching Image 2 */}
                    <div className="space-y-1 pt-1 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          No DR
                        </span>
                        <span>0,02</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          Mild
                        </span>
                        <span>0,08</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-0.5 rounded bg-blue-900/60 border border-blue-500/50 text-white font-bold">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Moderate
                        </span>
                        <span className="text-amber-300 font-bold">0,96</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          Severe
                        </span>
                        <span>0,03</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Proliferative
                        </span>
                        <span>0,01</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. STATISTICS STRIP (Exact Match to Image 2)
         ======================================================== */}
      <section className="bg-white border-y border-slate-200/90 py-6 sm:py-7" id="statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 items-center">
            
            {/* Stat 1: 537M+ */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B] leading-none mb-1">
                  537M+
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                  People with Diabetes Worldwide
                </div>
              </div>
            </div>

            {/* Stat 2: 1 in 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B] leading-none mb-1">
                  1 in 3
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                  May develop Retinopathy
                </div>
              </div>
            </div>

            {/* Stat 3: 98% */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B] leading-none mb-1">
                  98%
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                  Vision loss can be prevented
                </div>
              </div>
            </div>

            {/* Stat 4: 5 Levels */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B] leading-none mb-1">
                  5
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                  Grading Levels (No DR – Proliferative)
                </div>
              </div>
            </div>

            {/* Quote Block on Right */}
            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
              <div className="text-2xl font-serif text-[#0B1B3B] font-bold leading-none mb-1">“</div>
              <p className="text-sm sm:text-base font-serif font-bold text-[#0B1B3B] leading-snug">
                Earlier detection today. A brighter tomorrow for millions.
              </p>
              <div className="w-10 h-0.5 bg-teal-600 mt-2" />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHY IT MATTERS SECTION (Exact Match to Image 2)
         ======================================================== */}
      <section className="py-14 sm:py-18 lg:py-20 bg-[#F8FAFC]" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-4">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-2 font-mono">
                WHY IT MATTERS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B1B3B] leading-tight mb-4">
                Early Detection Saves Vision
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-7">
                Diabetic Retinopathy is a leading cause of preventable blindness worldwide. Our multi-feature learning approach leverages advanced deep learning models to improve the accuracy and reliability of DR grading, enabling early intervention and better patient care.
              </p>
              <button
                onClick={onStartDiagnosis}
                id="why-it-matters-learn-btn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B1B3B] text-white text-base font-semibold hover:bg-[#13274F] transition-all cursor-pointer group shadow-xs hover:shadow-sm"
              >
                <span>Learn More About DR</span>
                <ArrowRight className="w-4 h-4 text-blue-300 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right 4 Pastel Pillar Cards from Image 2 */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Card 1: High Accuracy */}
              <div className="bg-[#E8F8F5] border border-teal-100 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0B1B3B] mb-2">
                    High Accuracy
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Combines multiple image features for robust and precise grading.
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-teal-500 mt-6" />
              </div>

              {/* Card 2: Real-time Prediction */}
              <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0B1B3B] mb-2">
                    Real-time Prediction
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Get instant grading results from retinal fundus images.
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-blue-500 mt-6" />
              </div>

              {/* Card 3: Clinical Support */}
              <div className="bg-[#FFF5F2] border border-orange-100 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-5">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0B1B3B] mb-2">
                    Clinical Support
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Assists ophthalmologists with reliable AI-based analysis.
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-orange-500 mt-6" />
              </div>

              {/* Card 4: Meaningful Impact */}
              <div className="bg-[#F3E8FF] border border-purple-100 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0B1B3B] mb-2">
                    Meaningful Impact
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Helps prevent vision loss and improves quality of life.
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-purple-500 mt-6" />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. METHODOLOGY SECTION (Exact Match to Image 2 Pipeline)
         ======================================================== */}
      <section className="py-14 sm:py-18 bg-[#0B1B3B] text-white relative overflow-hidden" id="performance">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-4">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-teal-400 uppercase block mb-2 font-mono">
                OUR APPROACH
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold leading-tight mb-4 text-white">
                A Smarter Way to See
              </h2>
              <p className="text-base text-slate-300 leading-relaxed mb-7">
                We integrate multiple image features using state-of-the-art deep learning models (ConvNeXtV2 + Swin Transformer) to capture both global and local patterns from retinal images, leading to more accurate and consistent DR grading.
              </p>
              <button
                onClick={() => onNavigateDashboard('platform')}
                id="explore-methodology-btn"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/60 hover:border-white text-white text-sm font-semibold transition-all hover:bg-white/10 cursor-pointer"
              >
                <span>Explore Methodology</span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </button>
            </div>

            {/* Center + Right: Visual Pipeline Box matching Image 2 */}
            <div className="lg:col-span-8 bg-[#0F1D38] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* 3-Step Pipeline Flow */}
                <div className="md:col-span-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-b md:border-b-0 md:border-r border-slate-800 md:pr-6">
                  
                  {/* Step 1: Input Retinal Image */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-teal-400/80 p-0.5 bg-black shadow-lg">
                      <img
                        src={samplePredictions[0].imageUrl}
                        alt="Input Retinal Image"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-2">Input</div>
                    <div className="text-xs text-slate-400">Retinal Image</div>
                  </div>

                  {/* Arrow 1 */}
                  <ArrowRight className="w-5 h-5 text-slate-500 hidden sm:block shrink-0" />

                  {/* Step 2: Hybrid Deep Learning Model */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-26 h-20 relative flex items-center justify-center">
                      <div className="absolute w-12 h-16 bg-teal-500/30 border border-teal-400 rounded transform -rotate-12 -translate-x-3 shadow-md" />
                      <div className="absolute w-12 h-16 bg-blue-500/40 border border-blue-400 rounded transform -rotate-6 shadow-md" />
                      <div className="absolute w-12 h-16 bg-slate-800 border border-slate-300/80 rounded transform rotate-0 translate-x-3 shadow-lg flex flex-col items-center justify-center p-1 text-[8px] font-mono font-bold text-white">
                        <span>ConvNeXt</span>
                        <span className="text-teal-400">+ Swin</span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">
                      Hybrid Deep Learning Model
                    </div>
                    <div className="text-[11px] text-teal-300 font-mono">
                      (ConvNeXtV2 + Swin)
                    </div>
                  </div>

                  {/* Arrow 2 */}
                  <ArrowRight className="w-5 h-5 text-slate-500 hidden sm:block shrink-0" />

                  {/* Step 3: DR Grade Prediction Card */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 w-38 shadow-lg">
                      <div className="text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800 pb-1 mb-2 font-semibold">
                        DR Grade Prediction
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>No DR</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span>Mild</span>
                        </div>
                        {/* Highlighted Moderate Grade as in Image 2 */}
                        <div className="flex items-center gap-2 text-white font-bold bg-[#2563EB] px-2 py-0.5 rounded shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>Moderate</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-orange-400" />
                          <span>Severe</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>Proliferative</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right 4 Pillar Items from Image 2 */}
                <div className="md:col-span-4 space-y-2.5">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      Retinal Feature Extraction
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                      <GitMerge className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      Feature Fusion
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      Classification
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      Explainable Results
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. RESULTS SHOWCASE (Exact Match to Image 2)
         ======================================================== */}
      <section className="py-14 sm:py-18 bg-white border-b border-slate-200/80" id="prediction">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-1.5 font-mono">
                RESULTS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B1B3B] leading-tight mb-2">
                Visual Insights. Real Impact.
              </h2>
              <p className="text-base text-slate-600 max-w-2xl mb-2">
                Our model delivers high accuracy across all grading levels, demonstrating the potential to support real-world clinical use.
              </p>
              <button
                onClick={() => onNavigateDashboard('analytics')}
                id="view-detailed-results-btn"
                className="inline-flex items-center gap-1.5 text-base font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                <span>View Detailed Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 5 Fundus Image Circles from Image 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {([0, 1, 2, 3, 4] as DRGrade[]).map((grade) => {
              const meta = gradeMetadata[grade];
              const isSelected = selectedResultGrade === grade;
              const gradeNames = ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative'];

              return (
                <div
                  key={grade}
                  onClick={() => {
                    setSelectedResultGrade(grade);
                    if (onSelectGradeDemo) onSelectGradeDemo(grade);
                  }}
                  id={`result-grade-card-${grade}`}
                  className={`group cursor-pointer rounded-2xl p-4 transition-all border text-center flex flex-col items-center ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  {/* Fundus Circular Image */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 bg-black p-0.5 shadow-xs group-hover:scale-105 transition-transform">
                    <img
                      src={
                        samplePredictions.find((p) => p.predictedGrade === grade)?.imageUrl ||
                        samplePredictions[0].imageUrl
                      }
                      alt={meta.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Grade Label */}
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0B1B3B]">
                    {gradeNames[grade]}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Interactive Selected Grade Detail Drawer */}
          <div className="mt-8 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-left max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="font-serif font-bold text-lg text-[#0B1B3B]">
                  {gradeMetadata[selectedResultGrade].fullName}
                </span>
                <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ICD-10: {gradeMetadata[selectedResultGrade].icd10.split(' ')[0]}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                {gradeMetadata[selectedResultGrade].clinicalCriteria}
              </p>
              <div className="text-sm text-blue-700 font-medium pt-0.5">
                Clinical Recommendation: {gradeMetadata[selectedResultGrade].followUpRecommendation}
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectGradeDemo) onSelectGradeDemo(selectedResultGrade);
                onNavigateDashboard('diagnostic');
              }}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <span>Examine in Diagnostics</span>
              <ArrowRight className="w-4 h-4 text-blue-300" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. A HEALTHIER TOMORROW / IMPACT & TESTIMONIAL (Exact Match to Image 2)
         ======================================================== */}
      <section className="py-14 sm:py-18 bg-[#F8FAFC] relative overflow-hidden" id="impact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Heading, description, CTA */}
            <div className="lg:col-span-5">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-1.5 font-mono">
                A HEALTHIER TOMORROW
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0B1B3B] leading-tight mb-4">
                Technology for Humanity
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-7">
                We envision a world where no one loses their sight due to late detection. DR Vision bridges the gap between advanced AI research and real-world healthcare, making early screening more accessible.
              </p>
              <button
                onClick={onStartDiagnosis}
                id="impact-cta-btn"
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#0B1B3B] text-white text-base font-semibold hover:bg-[#13274F] transition-all shadow-xs cursor-pointer group"
              >
                <span>Be Part of the Change</span>
                <ArrowRight className="w-4 h-4 text-blue-300 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Center: Warm Grandfather & Grandchild Image with Script from Image 2 */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-xl aspect-4/5 bg-slate-900">
                <img
                  src={familyEyesBright}
                  alt="Clearer Eyes Brighter Futures"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Handwritten script flourish matching Image 2 */}
                <div
                  className="absolute top-6 right-4 text-3xl sm:text-4xl text-[#FEF3C7] -rotate-3 select-none leading-none drop-shadow-md"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  <div>Clearer</div>
                  <div className="pl-4">Eyes</div>
                  <div className="text-2xl sm:text-3xl pl-2">Brighter</div>
                  <div className="pl-5">Futures</div>
                </div>
              </div>
            </div>

            {/* Right Column: Physician Testimonial Card */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs relative">
                <div className="text-3xl font-serif text-slate-400 font-bold leading-none mb-2">
                  “
                </div>
                <p className="text-base italic font-serif text-slate-700 leading-relaxed mb-5">
                  "{testimonials[testimonialIndex].quote}"
                </p>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mb-3">
                  <img
                    src={testimonials[testimonialIndex].avatar}
                    alt={testimonials[testimonialIndex].author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#0B1B3B]">
                      {testimonials[testimonialIndex].author}
                    </div>
                    <div className="text-xs text-slate-500">
                      {testimonials[testimonialIndex].role}
                    </div>
                    <div className="text-xs text-slate-400">
                      {testimonials[testimonialIndex].dept}
                    </div>
                  </div>
                </div>

                {/* Testimonial slider navigation */}
                <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-100">
                  <button
                    onClick={() =>
                      setTestimonialIndex((prev) =>
                        prev === 0 ? testimonials.length - 1 : prev - 1
                      )
                    }
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {testimonials.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => setTestimonialIndex(idx)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                          idx === testimonialIndex
                            ? 'bg-[#0B1B3B] w-3.5'
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setTestimonialIndex((prev) =>
                        prev === testimonials.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom 3 Impact Badges matching Image 2 */}
          <div className="mt-12 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-2.5 text-slate-800">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-semibold">Improve Lives</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-slate-800">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-semibold">Support Research</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-slate-800">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-semibold">Build Healthier Communities</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. FOOTER (Exact Match to Image 2)
         ======================================================== */}
      {!hideNavAndFooter && (
        <footer className="bg-[#0B1B3B] text-white pt-10 pb-8 border-t border-slate-800" id="contact">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
              {/* Brand Logo in Light Variant */}
              <BrandLogo variant="light" size="md" />

              {/* Nav links */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
                <a href="#home" className="hover:text-white transition-colors">Home</a>
                <a href="#prediction" className="hover:text-white transition-colors">Prediction</a>
                <button
                  onClick={() => onNavigateDashboard('grad-cam')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Grad-CAM
                </button>
                <a href="#performance" className="hover:text-white transition-colors">Performance</a>
                <a href="#about" className="hover:text-white transition-colors">About</a>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              </div>

              {/* Social Icons + Start Diagnosis Button + Slogan */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={onStartDiagnosis}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <span>Start Diagnosis</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
                </button>

                <div className="hidden xl:block text-right font-mono text-[9px] tracking-widest text-slate-400 leading-tight">
                  <div>FOR A</div>
                  <div>BRIGHTER</div>
                  <div>TOMORROW</div>
                </div>
              </div>

            </div>

            {/* Bottom Legal bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div>© 2024 DR Vision. All rights reserved.</div>
              <div className="flex items-center gap-6">
                <a href="#about" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                <span>|</span>
                <a href="#about" className="hover:text-slate-300 transition-colors">Terms of Use</a>
                <span>|</span>
                <span className="text-teal-400 font-mono">Research Use Only</span>
              </div>
            </div>

          </div>
        </footer>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-semibold text-white">
                  DR Vision: Clinical AI Overview
                </span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden">
                <img
                  src={clinicalEyeMacro}
                  alt="Clinical AI Pipeline"
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg mb-3">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white mb-1">
                    Multi-feature Learning for Retinopathy Detection
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    Dual-backbone ConvNeXtV2 and Swin Transformer architecture combining micro-lesion attention with global vascular arcade feature fusion.
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setVideoModalOpen(false);
                    onStartDiagnosis();
                  }}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Launch Clinical Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
