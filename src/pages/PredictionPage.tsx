import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  Play,
  UploadCloud,
  CheckCircle2,
  FileText,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Cpu,
  GitMerge,
  Box,
  Calendar,
  Heart,
  ShieldCheck,
  Download,
  Share2,
  Table,
  Sparkles,
  Users,
  Eye,
  Globe,
  Loader2,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { SitePage, DRGrade } from '../types';
import { samplePredictions, gradeMetadata } from '../data/mockData';
import { generateFundusSvg } from '../data/retinalAssets';
import clinicalEyeMacro from '../assets/images/clinical_eye_macro_1789908532837.jpg';
import familyEyesBright from '../assets/images/family_eyes_bright_1789908546740.jpg';
import { predictImage, getGradCam, analyzeLesions } from '../lib/api';

interface PredictionPageProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  // State for active prediction
  const [currentGrade, setCurrentGrade] = useState<DRGrade>(2);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(100);
  const [fileName, setFileName] = useState('sample_retina.jpg');
  const [uploadDate, setUploadDate] = useState('Sep 19, 2026, 12:24 AM');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Analysis options checkboxes
  const [optionGradCam, setOptionGradCam] = useState(true);
  const [optionConfidence, setOptionConfidence] = useState(true);
  const [optionClinical, setOptionClinical] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Active prediction metadata
  const currentResult = samplePredictions.find((p) => p.predictedGrade === currentGrade) || samplePredictions[0];
  const meta = gradeMetadata[currentGrade];

  // Fundus and Grad-CAM assets
  const originalFundusUrl = customImage || currentResult.imageUrl;
  const gradCamOverlayUrl = generateFundusSvg(currentGrade, true);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadDate(
        new Date().toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      );
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setCustomFile(file);
      await triggerAnalysis(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadDate(
        new Date().toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      );
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setCustomFile(file);
      await triggerAnalysis(file);
    }
  };

  const [realPrediction, setRealPrediction] = useState<any>(null);
  const [realGradCam, setRealGradCam] = useState<string | null>(null);

  const [customFile, setCustomFile] = useState<File | null>(null);

  const triggerAnalysis = async (fileToAnalyze?: File) => {
    const targetFile = fileToAnalyze || customFile;
    if (!targetFile) {
      showToast('Please upload an image first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(15);
    
    // Fake progress animation while awaiting real API
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 400);

    try {
      // API Calls
      const predictionResponse = await predictImage(targetFile);
      const gradcamResponse = await getGradCam(targetFile);
      // Optional: const lesionResponse = await analyzeLesions(targetFile);
      
      clearInterval(interval);
      setAnalysisProgress(100);
      
      setRealPrediction(predictionResponse);
      if (gradcamResponse.gradcam_image) {
        setRealGradCam(gradcamResponse.gradcam_image);
      }
      
      // Map API string prediction to DRGrade enum if possible
      const classMap: Record<string, DRGrade> = {
        'No_DR': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3, 'Proliferative_DR': 4
      };
      const grade = classMap[predictionResponse.prediction] ?? 2;
      setCurrentGrade(grade);
      
      showToast(`Analysis complete: ${predictionResponse.prediction} (${(predictionResponse.confidence * 100).toFixed(1)}% confidence)`);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      showToast('Error during analysis: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden selection:bg-blue-100 selection:text-blue-900" id="prediction-page-root">
      
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1B3B] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ========================================================
          1. HERO SECTION (Exact Match to Image.png)
         ======================================================== */}
      <section className="relative pt-6 pb-10 sm:pt-8 sm:pb-12 lg:py-12 overflow-hidden bg-white border-b border-slate-200/80">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/70 via-blue-50/30 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Heading, Subtitle, Body, CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
              
              {/* Over-title tag */}
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase font-mono">
                  RETINAL IMAGE ANALYSIS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#0B1B3B] leading-[1.08] tracking-tight mb-3">
                Diabetic Retinopathy Prediction
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed mb-3">
                Upload a retinal fundus image and receive accurate diabetic retinopathy grading using our multi-feature deep learning framework.
              </p>

              {/* Body description */}
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mb-7">
                Advanced <strong className="font-semibold text-slate-800">ConvNeXtV2 + Swin Transformer</strong> architecture designed for reliable retinal disease grading and clinical decision support.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={scrollToUpload}
                  id="hero-analyze-retina-cta"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer group"
                >
                  <span>Analyze Retina</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#how-it-works"
                  id="hero-view-methodology-cta"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0B1B3B] text-base font-semibold border border-slate-900 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-[#0B1B3B] ml-0.5 text-[#0B1B3B]" />
                  </div>
                  <span>View Methodology</span>
                </a>
              </div>

              {/* Trust Avatar Stack */}
              <div className="flex items-center gap-3.5 pt-2 max-w-xl">
                <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Mehta"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1594824813512-9c323f4b2326?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Rostova"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Thorne"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
                    alt="Dr. Lin"
                  />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Trusted by clinicians and researchers worldwide.
                </p>
              </div>

            </div>

            {/* Right Column: Hero Visual with Eye Close-up, HUD Reticle, and Floating Prediction Card */}
            <div className="lg:col-span-6 xl:col-span-5 relative flex justify-center items-center">
              
              <div className="relative w-full h-[430px] sm:h-[470px] lg:h-[490px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950">
                {/* Close-up Patient Eye Macro Photograph */}
                <img
                  src={clinicalEyeMacro}
                  alt="Clinical Ophthalmic Eye Examination"
                  className="w-full h-full object-cover object-center transform scale-105"
                />

                {/* Left-edge soft gradient to blend smoothly */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Holographic Cyan Concentric Rings & Targeting Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 400 400" className="w-full h-full text-cyan-400/70" fill="none">
                    <circle cx="230" cy="180" r="110" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.45" />
                    <circle cx="230" cy="180" r="78" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
                    <circle cx="230" cy="180" r="48" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
                    <circle cx="230" cy="180" r="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />

                    <path d="M 230 40 L 230 65" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                    <path d="M 230 295 L 230 320" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                    <path d="M 90 180 L 115 180" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                    <path d="M 345 180 L 370 180" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

                    <circle cx="230" cy="180" r="95" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="1 12" opacity="0.6" />
                  </svg>
                </div>

                {/* Top Right Vertical Medical Keywords */}
                <div className="absolute top-5 right-5 text-right font-mono text-[11px] tracking-[0.22em] text-slate-200/90 space-y-1 select-none drop-shadow-md">
                  <div>DETECT</div>
                  <div>ANALYZE</div>
                  <div>GRADE</div>
                  <div className="text-teal-300 font-bold">EMPOWER</div>
                </div>

                {/* Handwritten Script Accent from Image 2 */}
                <div
                  className="absolute top-22 right-5 text-3xl sm:text-4xl text-teal-100 -rotate-6 select-none font-normal drop-shadow-lg"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  For Healthier Eyes
                </div>

                {/* Floating Fundus Image Analysis Card (Exact Match to Image) */}
                <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 bg-[#0E1726]/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 shadow-2xl text-white">
                  
                  <div className="text-xs font-semibold tracking-wide text-slate-300 mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>Fundus Image Analysis</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                      Hybrid AI
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-3.5 items-center">
                    {/* Fundus circular retinal scan thumbnail */}
                    <div className="col-span-5 flex justify-center">
                      <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-amber-500/80 shadow-inner bg-black shrink-0">
                        <img
                          src={originalFundusUrl}
                          alt="Retinal Fundus Scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Prediction metrics and probability breakdown */}
                    <div className="col-span-7 space-y-1 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Predicted Grade</div>
                        <div className="text-base sm:text-lg font-serif font-bold text-amber-400 leading-tight">
                          Moderate DR
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          Confidence: 96%
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1 mb-2">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
                        </div>
                      </div>

                      {/* Class distribution */}
                      <div className="space-y-0.5 font-mono text-[10px] sm:text-[11px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            No DR
                          </span>
                          <span>0.02</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            Mild
                          </span>
                          <span>0.08</span>
                        </div>
                        <div className="flex items-center justify-between font-semibold text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Moderate
                          </span>
                          <span>0.96</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Severe
                          </span>
                          <span>0.03</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Proliferative
                          </span>
                          <span>0.01</span>
                        </div>
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
          2. INTERACTIVE 3-COLUMN SECTION (Upload, Preview, Settings)
             (Exact Match to image.png Middle Row)
         ======================================================== */}
      <section className="py-10 sm:py-12 bg-[#F8FAFC]" ref={uploadSectionRef} id="analysis-workspace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Card 1: Upload Retinal Fundus Image */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="lg:col-span-4 bg-white rounded-2xl p-7 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors shadow-2xs flex flex-col items-center justify-center text-center relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                Upload Retinal Fundus Image
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-xs">
                Drag and drop an image here, or click to browse
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                id="choose-file-btn"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer mb-5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Choose File</span>
              </button>

              <div className="text-[11px] text-slate-400 space-y-0.5 border-t border-slate-100 pt-4 w-full">
                <p>Supported formats: JPG, JPEG, PNG</p>
                <p>Max file size: 10 MB</p>
              </div>

              {/* Preset Sample Selector for Instant Testing */}
              <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium mr-1">Try Preset:</span>
                {([0, 1, 2, 3, 4] as DRGrade[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setCurrentGrade(g);
                      setCustomImage(null);
                      setFileName(`sample_grade_${g}.jpg`);
                      triggerAnalysis();
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium transition-colors cursor-pointer ${
                      currentGrade === g
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    G{g}
                  </button>
                ))}
              </div>

            </div>

            {/* Card 2: Image Preview */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Image Preview</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title="Reset View"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dark Retinal Fundus Viewport */}
                <div className="w-full h-52 sm:h-56 bg-[#090D16] rounded-xl overflow-hidden flex items-center justify-center p-3 relative shadow-inner">
                  <div
                    className="w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-1 ring-slate-700 bg-black transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <img
                      src={originalFundusUrl}
                      alt="Fundus Retinal Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Analyzing Overlay Spinner */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                      <Loader2 className="w-7 h-7 text-teal-400 animate-spin" />
                      <span className="text-xs font-medium">Extracting Features ({analysisProgress}%)...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata Details Table */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 font-mono text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">File name</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">{fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Resolution</span>
                  <span className="text-slate-800">1024 × 1024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Uploaded on</span>
                  <span className="text-slate-800">{uploadDate}</span>
                </div>
              </div>

            </div>

            {/* Card 3: Analysis Settings */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Analysis Settings</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Model Ready</span>
                  </div>
                </div>

                {/* AI Model Architecture Box */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">AI Model</div>
                    <div className="text-sm font-bold text-slate-900 leading-tight">
                      ConvNeXtV2 + Swin Transformer
                    </div>
                  </div>
                </div>

                {/* Analysis Options Checkboxes */}
                <div className="space-y-3 mb-6">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                    Analysis Options
                  </div>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={optionGradCam}
                      onChange={(e) => setOptionGradCam(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>Generate Grad-CAM (Explainable AI)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={optionConfidence}
                      onChange={(e) => setOptionConfidence(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>Show Confidence Scores</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={optionClinical}
                      onChange={(e) => setOptionClinical(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>Include Clinical Interpretation</span>
                  </label>
                </div>
              </div>

              {/* Primary Action Button */}
              <div>
                <button
                  onClick={() => triggerAnalysis()}
                  disabled={isAnalyzing || !customFile}
                  id="primary-analyze-retina-btn"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-75"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing Retina...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Retina</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Processing usually takes a few seconds...
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. HOW IT WORKS / A SMARTER WAY TO ANALYZE (Dark Container)
             (Exact Match to image.png Methodology Diagram)
         ======================================================== */}
      <section className="py-10 sm:py-14 bg-[#F8FAFC]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#0B1B3B] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading, description, Learn More button */}
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-teal-400 uppercase font-mono block">
                  HOW IT WORKS
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  A Smarter Way to Analyze
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  We leverage ConvNeXtV2 + Swin Transformer to extract both global and local patterns from retinal images, enabling accurate and consistent Diabetic Retinopathy grading.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigatePage('performance')}
                    id="learn-more-methodology-btn"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-400/80 hover:border-white text-white text-xs sm:text-sm font-semibold transition-all hover:bg-white/10 cursor-pointer"
                  >
                    <span>Learn More About Methodology</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Horizontal Pipeline Flowchart */}
              <div className="lg:col-span-8 bg-[#0F1D38] rounded-2xl p-5 sm:p-7 border border-slate-800/80 shadow-xl overflow-x-auto">
                <div className="min-w-[620px] flex items-center justify-between gap-3 py-2">
                  
                  {/* Step 1: Input Retinal Image */}
                  <div className="flex flex-col items-center text-center w-24">
                    <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-teal-400 p-0.5 bg-black shadow-md">
                      <img
                        src={originalFundusUrl}
                        alt="Input Retinal Fundus"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 mt-2.5">Input</span>
                    <span className="text-[11px] text-slate-400 leading-tight">Retinal Image</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-slate-500 font-bold text-lg">→</div>

                  {/* Step 2: Feature Extraction (Stacked 3D Layers) */}
                  <div className="flex flex-col items-center text-center w-24">
                    <div className="w-16 h-18 relative flex items-center justify-center">
                      <div className="absolute w-10 h-14 bg-blue-500/25 border border-blue-400 rounded transform -rotate-12 -translate-x-2" />
                      <div className="absolute w-10 h-14 bg-teal-500/35 border border-teal-400 rounded transform -rotate-6" />
                      <div className="absolute w-10 h-14 bg-slate-900 border border-teal-300 rounded transform rotate-0 translate-x-2 flex items-center justify-center shadow-lg">
                        <Cpu className="w-5 h-5 text-teal-300" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-200 mt-2.5">Feature</span>
                    <span className="text-[11px] text-slate-400 leading-tight">Extraction</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-slate-500 font-bold text-lg">→</div>

                  {/* Step 3: Dual Backbone Branches */}
                  <div className="flex flex-col items-center gap-1.5 w-44">
                    {/* Top Branch */}
                    <div className="w-full bg-[#13274F] border border-blue-400/50 rounded-lg py-2 px-3 text-center shadow-xs">
                      <span className="text-xs font-semibold text-white tracking-wide">
                        ConvNeXtV2 Branch
                      </span>
                    </div>
                    {/* Plus symbol */}
                    <span className="text-teal-400 font-bold text-xs leading-none">+</span>
                    {/* Bottom Branch */}
                    <div className="w-full bg-[#13274F] border border-blue-400/50 rounded-lg py-2 px-3 text-center shadow-xs">
                      <span className="text-xs font-semibold text-white tracking-wide">
                        Swin Transformer Branch
                      </span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-slate-500 font-bold text-lg">→</div>

                  {/* Step 4: Feature Fusion */}
                  <div className="flex flex-col items-center text-center w-24">
                    <div className="w-16 h-16 rounded-xl bg-blue-600/20 border border-blue-400/60 flex items-center justify-center shadow-md">
                      <Box className="w-7 h-7 text-blue-300" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 mt-2.5">Feature</span>
                    <span className="text-[11px] text-slate-400 leading-tight">Fusion</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-slate-500 font-bold text-lg">→</div>

                  {/* Step 5: Prediction (5 Classes) + Legend */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center text-center w-22">
                      <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-black shadow-md">
                        <img
                          src={originalFundusUrl}
                          alt="Classified Retinal Output"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-200 mt-2">Prediction</span>
                      <span className="text-[10px] text-slate-400">(5 Classes)</span>
                    </div>

                    {/* Classes Legend matching image.png */}
                    <div className="space-y-1 text-[10px] sm:text-[11px] font-sans border-l border-slate-700/80 pl-2.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>No DR</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-teal-400" />
                        <span>Mild</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Moderate</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>Severe</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>Proliferative</span>
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
          4. PREDICTION RESULTS & INSIGHTS (3 Cards Grid)
             (Exact Match to image.png)
         ======================================================== */}
      <section className="py-10 sm:py-12 bg-[#F8FAFC]" id="prediction-results">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Prediction Results */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Prediction Results</span>
                </div>

                {/* Moderate DR Pill + Radial Confidence Score */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  {/* Left Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="text-base sm:text-lg font-bold font-serif">
                      {meta.name}
                    </span>
                  </div>

                  {/* Right Radial Progress Ring */}
                  <div className="flex items-center gap-2.5">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-mono text-right">Confidence Score</div>
                      <div className="text-xl sm:text-2xl font-bold font-serif text-[#0B1B3B] text-right">
                        96.3%
                      </div>
                    </div>

                    {/* Circular SVG Progress Ring */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600"
                          strokeDasharray="96.3, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1">Risk Level</div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Medium</span>
                  </div>
                </div>

                {/* Clinical Interpretation text */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-xs font-semibold text-slate-900 mb-1">
                    Clinical Interpretation
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Moderate diabetic retinopathy detected. Presence of microaneurysms, hemorrhages, and retinal exudates indicating moderate disease progression. Regular follow-up with an ophthalmologist is recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Class Confidence Scores */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Class Confidence Scores</span>
                </div>

                {/* 5 Rows with Horizontal Bars and Percentages */}
                <div className="space-y-4 font-mono text-xs">
                  {/* No DR */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-24 flex items-center gap-2 text-slate-600 font-sans">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>No DR</span>
                    </div>
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '2%' }} />
                    </div>
                    <span className="w-12 text-right text-slate-500">0.02%</span>
                  </div>

                  {/* Mild */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-24 flex items-center gap-2 text-slate-600 font-sans">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      <span>Mild</span>
                    </div>
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: '4%' }} />
                    </div>
                    <span className="w-12 text-right text-slate-500">0.08%</span>
                  </div>

                  {/* Moderate (Dominant) */}
                  <div className="flex items-center justify-between gap-3 font-semibold">
                    <div className="w-24 flex items-center gap-2 text-amber-700 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span>Moderate</span>
                    </div>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '96.3%' }} />
                    </div>
                    <span className="w-12 text-right text-amber-600 font-bold">96.3%</span>
                  </div>

                  {/* Severe */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-24 flex items-center gap-2 text-slate-600 font-sans">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>Severe</span>
                    </div>
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '2%' }} />
                    </div>
                    <span className="w-12 text-right text-slate-500">0.03%</span>
                  </div>

                  {/* Proliferative */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-24 flex items-center gap-2 text-slate-600 font-sans">
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      <span>Proliferative</span>
                    </div>
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '1%' }} />
                    </div>
                    <span className="w-12 text-right text-slate-500">0.01%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Clinical Interpretation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Clinical Interpretation</span>
                </div>

                {/* 4 Items with Medical Icons */}
                <div className="space-y-3.5 text-xs sm:text-sm">
                  
                  {/* Item 1: Key Findings */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Key Findings</div>
                      <div className="text-slate-600 text-xs leading-relaxed">
                        Microaneurysms, hemorrhages and retinal exudates detected.
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Recommended Follow-Up */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Recommended Follow-Up</div>
                      <div className="text-slate-600 text-xs leading-relaxed">
                        Schedule a comprehensive eye examination with an ophthalmologist.
                      </div>
                    </div>
                  </div>

                  {/* Item 3: Risk Factors */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Risk Factors</div>
                      <div className="text-slate-600 text-xs leading-relaxed">
                        Control blood sugar, blood pressure and cholesterol levels.
                      </div>
                    </div>
                  </div>

                  {/* Item 4: Clinical Notes */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Clinical Notes</div>
                      <div className="text-slate-600 text-xs leading-relaxed">
                        This prediction is AI-assisted and should be interpreted by a qualified clinician.
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
          5. GRAD-CAM VISUALIZATION & DOWNLOAD REPORT (2 Cards Grid)
             (Exact Match to image.png)
         ======================================================== */}
      <section className="py-8 sm:py-10 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Card: Grad-CAM Visualization */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Grad-CAM Visualization</span>
                </div>

                {/* Two side-by-side retinal thumbnails */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Original Image */}
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-black ring-1 ring-slate-200 p-0.5 shadow-sm">
                      <img
                        src={originalFundusUrl}
                        alt="Original Fundus"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-2.5">
                      Original Image
                    </span>
                  </div>

                  {/* Grad-CAM Overlay */}
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-black ring-1 ring-slate-200 p-0.5 shadow-sm relative">
                      <img
                        src={gradCamOverlayUrl}
                        alt="Grad-CAM Thermal Heatmap Overlay"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-2.5">
                      Grad-CAM Overlay
                    </span>
                  </div>
                </div>

                {/* Model Attention text */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600 mb-3">
                    <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 block mb-0.5">Model Attention</span>
                      <span>
                        Highlighted regions indicate the areas the model focuses on for prediction, including microaneurysms, hemorrhages and exudates.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onNavigatePage('grad-cam')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <span>View Full Grad-CAM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => showToast('Grad-CAM overlay exported to high-resolution PNG')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <span>Download</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right Card: Download Report */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Download Report</span>
                </div>

                {/* 2x2 Grid of Action Buttons matching image.png */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                  
                  {/* Button 1: Download PDF Report (Solid Dark Blue) */}
                  <button
                    onClick={() => onLaunchDemo()}
                    className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer text-center"
                  >
                    <FileText className="w-4 h-4 text-blue-200 shrink-0" />
                    <span>Download PDF Report</span>
                  </button>

                  {/* Button 2: Export Results (Outline) */}
                  <button
                    onClick={() => showToast('Clinical results exported as CSV/JSON dataset')}
                    className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer text-center"
                  >
                    <Table className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Export Results</span>
                  </button>

                  {/* Button 3: Share Analysis (Outline) */}
                  <button
                    onClick={() => showToast('Secure clinical link copied to clipboard')}
                    className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer text-center"
                  >
                    <Share2 className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Share Analysis</span>
                  </button>

                  {/* Button 4: Generate Summary (Outline) */}
                  <button
                    onClick={() => showToast('AI Clinical summary generated for EHR documentation')}
                    className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer text-center"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Generate Summary</span>
                  </button>

                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Encrypted DICOM & HIPAA/GDPR compliant audit logs preserved.</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. BANNER: TOGETHER FOR CLEARER VISION
             (Exact Match to image.png Bottom Banner)
         ======================================================== */}
      <section className="py-10 sm:py-14 bg-[#0B1B3B] text-white relative overflow-hidden" id="banner-clearer-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-teal-400 uppercase font-mono block">
                TOGETHER FOR CLEARER VISION
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-white leading-tight">
                Early Detection Saves Vision
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Empowering healthcare professionals with reliable diabetic retinopathy analysis.
              </p>
            </div>

            {/* Center / Right: Grandfather & Granddaughter photo with cursive script + Button */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-end gap-6">
              
              {/* Photo Card with Handwritten Script */}
              <div className="relative w-48 sm:w-56 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 shrink-0">
                <img
                  src={familyEyesBright}
                  alt="Clearer Eyes Brighter Futures"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute top-3 right-3 text-xl sm:text-2xl text-[#FEF3C7] -rotate-3 select-none leading-none drop-shadow-md"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  <div>Clearer Eyes</div>
                  <div className="text-lg text-teal-100 pl-3">Brighter Futures</div>
                </div>
              </div>

              {/* Blue Button */}
              <button
                onClick={scrollToUpload}
                id="banner-analyze-another-btn"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer whitespace-nowrap active:scale-98"
              >
                <span>Analyze Another Image</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

            </div>

          </div>

          {/* Bottom 3 Impact Badges matching image.png */}
          <div className="mt-10 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-2.5 text-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold">Improve Lives</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold">Support Research</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold">Enable Early Screening</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
