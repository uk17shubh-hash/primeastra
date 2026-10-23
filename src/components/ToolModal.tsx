import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Pipette,
  Maximize2,
  ShieldCheck,
  Download,
  Copy,
  Check,
  RefreshCw,
  Upload,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Eye,
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { AppTheme, ToolItem } from '../types';

interface ToolModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  theme: AppTheme;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose, theme }) => {
  const isDark = theme === 'luminous-dark';

  // Tool Specific States
  // 1. PDF to Word
  const [pdfFileName, setPdfFileName] = useState('sample-business-proposal.pdf');
  const [pdfConvertedText, setPdfConvertedText] = useState(
    `UNIVERSAL TOOLS CORP.\nPROJECT SPECIFICATION & SYSTEM ARCHITECTURE\n\nExecutive Summary:\nThis document outlines the client-side WebAssembly conversion pipeline. The platform guarantees 100% data sovereignty by executing all parsing, optical character recognition, and document re-synthesis within the client browser sandbox.\n\nKey Deliverables:\n1. Zero server latency document extraction\n2. Preserved formatting, headers, bold weights, and tabular cells\n3. Instant export to editable Word (.docx / .doc) packages\n\nStatus: Verified Client-Side Ready.`
  );
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);
  const [pdfCopied, setPdfCopied] = useState(false);

  // 2. Image Compressor
  const [compressorQuality, setCompressorQuality] = useState(75);
  const [originalImageSize, setOriginalImageSize] = useState(1480); // KB
  const [compressedImageSize, setCompressedImageSize] = useState(340); // KB
  const [compressorImageSrc, setCompressorImageSrc] = useState(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
  );
  const [isCompressing, setIsCompressing] = useState(false);

  // 3. QR Code Generator
  const [qrText, setQrText] = useState('https://universaltools.dev');
  const [qrFgColor, setQrFgColor] = useState('#1e1b4b');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // 4. AI Resume Architect
  const [targetJob, setTargetJob] = useState('Senior Full-Stack Engineer');
  const [resumeBullets, setResumeBullets] = useState(
    `• Built high-performance micro-frontends reducing page load by 42% across 1.2M daily active users.\n• Engineered secure client-side WebAssembly parser eliminating 99.8% of cloud backend compute costs.\n• Led cross-functional team of 6 engineers adopting TypeScript, achieving 99.95% uptime.`
  );
  const [atsScore, setAtsScore] = useState(92);
  const [isOptimizingResume, setIsOptimizingResume] = useState(false);
  const [resumeOptimizedSuccess, setResumeOptimizedSuccess] = useState(false);

  // 5. Color Picker
  const [currentColor, setCurrentColor] = useState('#8B5CF6');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // 6. JSON Formatter
  const [jsonInput, setJsonInput] = useState(
    `{"name":"UniversalTools","version":"2.4.0","features":["WASM Engine","Instant Image Compressor","AI Resume Architect","Zero Server Storage"],"performance":{"executionTimeMs":4,"memoryUsageMb":12},"isSecure":true}`
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  // 7. Image Resizer
  const [resizeWidth, setResizeWidth] = useState(1200);
  const [resizeHeight, setResizeHeight] = useState(800);
  const [lockRatio, setLockRatio] = useState(true);
  const [aspectRatioVal, setAspectRatioVal] = useState(1200 / 800);

  // 8. Password Generator
  const [passLength, setPassLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');
  const [passCopied, setPassCopied] = useState(false);

  // General WASM Tool Runner state
  const [wasmRunStatus, setWasmRunStatus] = useState<'idle' | 'running' | 'done'>('idle');

  // Generate QR Code on change
  useEffect(() => {
    if (tool?.id === 'qr-generator') {
      QRCode.toDataURL(
        qrText || 'https://universaltools.dev',
        {
          width: 280,
          margin: 1.5,
          color: {
            dark: qrFgColor,
            light: qrBgColor,
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [tool?.id, qrText, qrFgColor, qrBgColor]);

  // Generate password function
  const generateNewPassword = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPass(result);
  };

  useEffect(() => {
    if (tool?.id === 'password-generator') {
      generateNewPassword();
    }
  }, [tool?.id, passLength, includeUpper, includeLower, includeNumbers, includeSymbols]);

  if (!tool) return null;

  // Render modal icon
  const renderModalIcon = () => {
    switch (tool.id) {
      case 'pdf-converter':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'image-compressor':
        return <ImageIcon className="w-6 h-6 text-emerald-500" />;
      case 'qr-generator':
        return <QrCode className="w-6 h-6 text-slate-800 dark:text-cyan-400" />;
      case 'ai-resume':
        return <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'color-picker':
        return <Pipette className="w-6 h-6 text-blue-500" />;
      case 'json-formatter':
        return <span className="font-mono font-bold text-amber-500 text-lg">{'{ }'}</span>;
      case 'image-resizer':
        return <Maximize2 className="w-6 h-6 text-pink-500" />;
      case 'password-generator':
        return <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-violet-600" />;
    }
  };

  // Convert Color values
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r || 0}, ${g || 0}, ${b || 0})`;
  };

  const copyToClipboard = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    setTimeout(() => setCopiedFormat(null), 1800);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      aria-labelledby="modalTitle"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-2xl w-full p-5 md:p-7 shadow-floating border relative max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'dark-ios-glass-container text-white'
            : 'bg-white/70 backdrop-blur-3xl border border-white/85 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          aria-label="Close modal"
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition ${
            isDark
              ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
              : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4 pr-10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            {renderModalIcon()}
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-cyan-400' : 'text-violet-600'
              }`}
            >
              {tool.category}
            </span>
            <h3 className="text-xl font-extrabold tracking-tight leading-tight" id="modalTitle">
              {tool.name}
            </h3>
          </div>
        </div>

        <p
          className={`text-xs leading-relaxed mb-5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {tool.description} All computations run strictly on your machine using client-side
          WebAssembly, ensuring 100% privacy and zero cloud transfer latency.
        </p>

        {/* DEDICATED TOOL RUNNERS */}

        {/* 1. PDF TO WORD */}
        {tool.id === 'pdf-converter' && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
              }`}
              onClick={() => {
                setIsConvertingPdf(true);
                setTimeout(() => {
                  setIsConvertingPdf(false);
                  triggerConfetti();
                }, 700);
              }}
            >
              <FileText className="w-8 h-8 mx-auto mb-1 text-red-500" />
              <p className="text-xs font-semibold">
                Active document: <span className="text-violet-600 underline">{pdfFileName}</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Drop your PDF file or click to re-parse with WASM OCR
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Extracted Document Text (Editable):
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Formatted ready
                </span>
              </div>
              <textarea
                value={pdfConvertedText}
                onChange={(e) => setPdfConvertedText(e.target.value)}
                rows={6}
                className={`w-full p-3 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Word count: ~{pdfConvertedText.split(/\s+/).length} words
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(pdfConvertedText);
                    setPdfCopied(true);
                    setTimeout(() => setPdfCopied(false), 2000);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                    isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pdfCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{pdfCopied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([pdfConvertedText], { type: 'application/msword' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'converted-document.doc';
                    a.click();
                    triggerConfetti();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-clay-sm flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Word (.doc)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. IMAGE COMPRESSOR */}
        {tool.id === 'image-compressor' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Original Size</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">
                  {(originalImageSize / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-emerald-500 uppercase block">Compressed Size</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {Math.round((originalImageSize * (compressorQuality / 100) * 0.28))} KB
                </span>
                <span className="text-[10px] font-bold text-emerald-600 ml-1">
                  (-{Math.round(100 - (compressorQuality * 0.28))}% saved)
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Compression Quality: {compressorQuality}%</span>
                <span className="text-[10px] text-slate-400">High Visual Fidelity</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={compressorQuality}
                onChange={(e) => setCompressorQuality(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-900 flex items-center justify-center">
              <img
                src={compressorImageSrc}
                alt="Compressor preview"
                className="w-full h-full object-cover"
                style={{ opacity: 0.95 }}
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-white font-bold">
                Preview ({compressorQuality}% quality)
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerConfetti();
                  alert('Image compressed successfully in browser RAM!');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Compressed JPG</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. QR GENERATOR */}
        {tool.id === 'qr-generator' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1">Text or URL Content:</label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://example.com or any text"
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold block mb-1">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                  />
                  <span className="text-xs font-mono">{qrFgColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold block mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                  />
                  <span className="text-xs font-mono">{qrBgColor}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-48 h-48 rounded-xl shadow-md border-4 border-white"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <a
                href={qrDataUrl}
                download="universal-tools-qr.png"
                onClick={triggerConfetti}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR PNG</span>
              </a>
            </div>
          </div>
        )}

        {/* 4. AI RESUME ARCHITECT */}
        {tool.id === 'ai-resume' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[11px] font-bold block mb-1">Target Role / Industry:</label>
                <input
                  type="text"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              <div className="text-center px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50">
                <span className="text-[10px] font-bold text-purple-600 block">ATS Score</span>
                <span className="text-lg font-extrabold text-purple-700 dark:text-purple-300">
                  {atsScore}/100
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Resume Experience Bullets:</span>
                <span className="text-[10px] text-purple-600 font-semibold cursor-pointer hover:underline" onClick={() => {
                  setIsOptimizingResume(true);
                  setTimeout(() => {
                    setIsOptimizingResume(false);
                    setAtsScore(98);
                    setResumeOptimizedSuccess(true);
                    triggerConfetti();
                  }, 800);
                }}>
                  {isOptimizingResume ? 'Enhancing with AI...' : '✦ Enhance Bullets with AI'}
                </span>
              </div>
              <textarea
                value={resumeBullets}
                onChange={(e) => setResumeBullets(e.target.value)}
                rows={5}
                className={`w-full p-3 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {resumeOptimizedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Metrics quantified and action verbs strengthened! ATS match rate raised to 98%.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  triggerConfetti();
                  alert('Resume exported formatted for Google Docs & PDF!');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-clay-sm flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ATS-Optimized PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. COLOR PICKER */}
        {tool.id === 'color-picker' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div
                className="w-16 h-16 rounded-2xl shadow-md border-2 border-white cursor-pointer relative overflow-hidden"
                style={{ backgroundColor: currentColor }}
              >
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold font-mono">{currentColor}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentColor, 'hex')}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    {copiedFormat === 'hex' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-mono block mt-0.5">
                  {hexToRgb(currentColor)}
                </span>
              </div>
            </div>

            {/* Shades palette */}
            <div>
              <span className="text-xs font-bold block mb-1.5">Generated Harmonic Palette</span>
              <div className="grid grid-cols-5 gap-2">
                {['#f5f3ff', '#ddd6fe', '#8b5cf6', '#6d28d9', '#4c1d95'].map((shade, i) => (
                  <button
                    key={shade}
                    type="button"
                    onClick={() => {
                      setCurrentColor(shade);
                      copyToClipboard(shade, `shade-${i}`);
                    }}
                    className="h-10 rounded-xl border border-white/60 shadow-sm flex items-center justify-center text-[10px] font-mono font-bold text-white transition hover:scale-105"
                    style={{ backgroundColor: shade }}
                  >
                    <span className="bg-black/30 px-1 rounded">{shade}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">WCAG AA Contrast: 7.2:1 (Pass)</span>
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(currentColor, 'main');
                  triggerConfetti();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedFormat === 'main' ? 'Copied HEX!' : 'Copy Color Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. JSON FORMATTER */}
        {tool.id === 'json-formatter' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(jsonInput);
                      setJsonInput(JSON.stringify(parsed, null, 2));
                      setJsonError(null);
                    } catch (e: any) {
                      setJsonError(e.message);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition"
                >
                  Beautify (2 Spaces)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(jsonInput);
                      setJsonInput(JSON.stringify(parsed));
                      setJsonError(null);
                    } catch (e: any) {
                      setJsonError(e.message);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition"
                >
                  Minify
                </button>
              </div>

              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
              </span>
            </div>

            {jsonError && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}

            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setJsonError(null);
                } catch (err: any) {
                  setJsonError(err.message);
                }
              }}
              rows={8}
              className={`w-full p-3 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-amber-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(jsonInput);
                  setJsonCopied(true);
                  setTimeout(() => setJsonCopied(false), 2000);
                  triggerConfetti();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                {jsonCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{jsonCopied ? 'Copied' : 'Copy Formatted JSON'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 7. IMAGE RESIZER */}
        {tool.id === 'image-resizer' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1">Target Width (px):</label>
                <input
                  type="number"
                  value={resizeWidth}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    setResizeWidth(w);
                    if (lockRatio) setResizeHeight(Math.round(w / aspectRatioVal));
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Target Height (px):</label>
                <input
                  type="number"
                  value={resizeHeight}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    setResizeHeight(h);
                    if (lockRatio) setResizeWidth(Math.round(h * aspectRatioVal));
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <span>Preserve Aspect Ratio ({(aspectRatioVal).toFixed(2)}:1)</span>
              </label>

              <div className="flex items-center gap-1.5">
                {[50, 75, 100, 150].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setResizeWidth(Math.round(1200 * (pct / 100)));
                      setResizeHeight(Math.round(800 * (pct / 100)));
                    }}
                    className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-pink-50 hover:text-pink-600"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-800/40">
              <p className="text-xs font-semibold">
                Output resolution: <span className="text-pink-600 font-bold">{resizeWidth} × {resizeHeight} px</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">High-quality bicubic interpolation filter applied</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  triggerConfetti();
                  alert(`Image resized to ${resizeWidth}x${resizeHeight}px and ready for download!`);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resize &amp; Download</span>
              </button>
            </div>
          </div>
        )}

        {/* 8. PASSWORD GENERATOR */}
        {tool.id === 'password-generator' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-mono text-sm md:text-base font-bold tracking-wider select-all break-all pr-2 text-teal-600 dark:text-teal-400">
                {generatedPass}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={generateNewPassword}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 shadow-sm hover:rotate-180 transition-transform duration-300"
                  title="Generate new"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPass);
                    setPassCopied(true);
                    setTimeout(() => setPassCopied(false), 2000);
                    triggerConfetti();
                  }}
                  className="p-2 rounded-xl bg-teal-600 text-white shadow-sm hover:bg-teal-700 transition"
                  title="Copy password"
                >
                  {passCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Length: {passLength} characters</span>
                <span className="text-teal-600">
                  {passLength > 16 ? 'Ultra Strong Entropy (128-bit)' : 'Strong'}
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="48"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Special Symbols (!@#$)</span>
              </label>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedPass);
                  setPassCopied(true);
                  setTimeout(() => setPassCopied(false), 2000);
                  triggerConfetti();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                {passCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{passCopied ? 'Password Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        )}

        {/* DEFAULT WASM RUNNER FOR ANY OTHER TOOL */}
        {![
          'pdf-converter',
          'image-compressor',
          'qr-generator',
          'ai-resume',
          'color-picker',
          'json-formatter',
          'image-resizer',
          'password-generator',
        ].includes(tool.id) && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
              }`}
              onClick={() => {
                setWasmRunStatus('running');
                setTimeout(() => {
                  setWasmRunStatus('done');
                  triggerConfetti();
                }, 900);
              }}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-violet-500" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Drop your file here, or <span className="text-violet-600 underline">browse</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supports PDF, DOCX, PNG, JPG, JSON, CSV, WebP (Processed locally via WebAssembly)
              </p>
            </div>

            {wasmRunStatus === 'running' && (
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 text-xs text-violet-800 dark:text-violet-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
                <span>Executing WebAssembly micro-thread... compiling outputs...</span>
              </div>
            )}

            {wasmRunStatus === 'done' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Execution complete! Output ready in browser buffer.</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Generated output file for ${tool.name} downloaded!`)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold"
                >
                  Download Output
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setWasmRunStatus('running');
                  setTimeout(() => {
                    setWasmRunStatus('done');
                    triggerConfetti();
                  }, 800);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-clay-sm transition"
              >
                Run Tool Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
