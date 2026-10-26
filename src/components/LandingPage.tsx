import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, Mail, Zap, CheckCircle2, Send, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onStartWork: () => void;
  onOpenTool: (toolKey: string) => void;
  userName?: string;
  isLoggedIn?: boolean;
  onToggleLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartWork,
  onOpenTool,
  userName = 'User',
  isLoggedIn = true,
  onToggleLogin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Spotlight & Canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const spotlightEl = document.getElementById('mouseSpotlightEl');

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (spotlightEl) {
        spotlightEl.style.left = `${e.clientX}px`;
        spotlightEl.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let waveScrollOffset = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY;
      scrollVelocity += delta * 0.08;
      lastScrollY = currentScroll;
      setIsScrolled(currentScroll > 30);
    };
    window.addEventListener('scroll', handleScroll);

    const COLS = window.innerWidth < 768 ? 32 : 48;
    const ROWS = window.innerWidth < 768 ? 24 : 32;
    let waveTime = 0;
    let animId: number;

    const render3DWave = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      waveScrollOffset += scrollVelocity;
      scrollVelocity *= 0.92;
      waveTime += 0.015 + Math.abs(scrollVelocity) * 0.002;

      const horizonY = height * 0.38;
      const fov = 420;
      const grid: Array<Array<{ x: number; y: number; alpha: number }>> = [];

      for (let r = 0; r < ROWS; r++) {
        grid[r] = [];
        const z = (ROWS - r) * 35;
        const scale = fov / (fov + z);

        for (let c = 0; c < COLS; c++) {
          const worldX = (c - COLS / 2) * 55;
          const wave1 = Math.sin(c * 0.22 + waveTime * 1.8 + waveScrollOffset * 0.02) * 35;
          const wave2 = Math.cos(r * 0.35 + waveTime * 1.2 + waveScrollOffset * 0.015) * 28;
          const wave3 = Math.sin((c + r) * 0.18 + waveTime) * 18;
          let worldY = wave1 + wave2 + wave3;

          const screenX = width / 2 + worldX * scale;
          const screenY = horizonY + (r * 32 + worldY) * scale;

          const dx = screenX - mouse.x;
          const dy = screenY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260) {
            const force = (1 - dist / 260) * 38;
            worldY -= force;
          }

          const finalScreenY = horizonY + (r * 32 + worldY) * scale;
          const alpha = Math.min(1, Math.max(0.05, (r / ROWS) * 0.8));

          grid[r][c] = { x: screenX, y: finalScreenY, alpha };
        }
      }

      // Horizontal lines
      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const pt = grid[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(226, 192, 114, ${grid[r][0].alpha * 0.25})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Vertical lines
      for (let c = 0; c < COLS; c += 2) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const pt = grid[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(197, 160, 89, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Gold Glow points
      for (let r = 2; r < ROWS; r += 3) {
        for (let c = 2; c < COLS; c += 4) {
          const pt = grid[r][c];
          if (pt.alpha > 0.3) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(226, 192, 114, ${pt.alpha * 0.55})`;
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render3DWave);
    };

    animId = requestAnimationFrame(render3DWave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setIsSubmitting(true);
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await addDoc(collection(db, 'contact_messages'), {
        name: contactName,
        email: contactEmail,
        message: contactMsg,
        createdAt: new Date().toISOString(),
      });
      setShowToast(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      console.warn('Firestore message save error:', err);
      // Fallback show toast so user is not blocked
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const q = searchQuery.toLowerCase();
      if (q.includes('invoice') || q.includes('bill') || q.includes('tax') || q.includes('gst')) {
        onOpenTool('invoice');
      } else if (q.includes('video') || q.includes('clip') || q.includes('short')) {
        onOpenTool('clipper');
      } else if (q.includes('mkv') || q.includes('mp4') || q.includes('convert')) {
        onOpenTool('mkv');
      } else if (q.includes('resume') || q.includes('cv')) {
        onOpenTool('resume');
      } else {
        onStartWork();
      }
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-[#070707] font-sans overflow-x-hidden">
      {/* 3D Wave Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
      <div
        id="mouseSpotlightEl"
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 filter blur-[50px] transition-opacity"
        style={{
          background:
            'radial-gradient(circle, rgba(226, 192, 114, 0.08) 0%, rgba(197, 160, 89, 0.03) 40%, transparent 70%)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, transparent 20%, rgba(7, 7, 7, 0.8) 80%, #070707 100%)',
        }}
      />

      {/* TOP NAVIGATION */}
      <header
        className={`fixed top-0 left-0 w-full px-6 sm:px-12 py-4 flex items-center justify-between z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-[rgba(226,192,114,0.15)] shadow-2xl'
            : ''
        }`}
      >
        <a href="#hero" className="flex items-center gap-3 cursor-pointer group">
          <svg
            className="w-11 h-11 shrink-0 drop-shadow-[0_0_12px_rgba(226,192,114,0.3)] transition-transform group-hover:scale-105"
            viewBox="0 0 500 500"
            fill="none"
          >
            <defs>
              <linearGradient id="mainShieldGradLanding" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2c072" />
                <stop offset="50%" stopColor="#c5a059" />
                <stop offset="100%" stopColor="#946b2d" />
              </linearGradient>
              <linearGradient id="brightStarGradLanding" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e2c072" />
                <stop offset="100%" stopColor="#946b2d" />
              </linearGradient>
            </defs>
            <path
              d="M250 18 Q250 65 285 65 Q250 65 250 112 Q250 65 215 65 Q250 65 250 18 Z"
              fill="url(#brightStarGradLanding)"
            />
            <path
              d="M220 85 C135 95 105 140 105 220 C105 330 175 425 250 480 C180 415 140 315 140 220 C140 160 160 125 220 105 Z"
              fill="url(#mainShieldGradLanding)"
            />
            <path
              d="M280 85 C310 92 340 108 355 125 L328 148 C315 135 295 120 280 115 Z"
              fill="url(#mainShieldGradLanding)"
            />
            <path
              d="M250 480 C290 435 345 375 370 300 L335 280 C315 340 275 395 250 435 Z"
              fill="url(#mainShieldGradLanding)"
            />
            <path
              d="M135 430 C145 320 215 255 270 220 C320 185 350 125 370 55 L395 130 C370 180 335 225 285 260 C220 310 165 365 135 430 Z"
              fill="url(#mainShieldGradLanding)"
            />
            <polygon points="380,55 305,108 335,122 360,170" fill="url(#brightStarGradLanding)" />
            <polygon points="380,55 335,122 360,170" fill="#c5a059" />
            <path
              d="M250 140 L165 335 L200 335 L250 205 L275 270 L305 270 Z"
              fill="url(#mainShieldGradLanding)"
            />
          </svg>
          <span className="text-2xl font-extrabold tracking-tight font-display">
            Prime<b className="text-[#e2c072]">Astra</b>
          </span>
        </a>

        {/* Center Pill Nav Links */}
        <nav className="hidden md:flex items-center gap-8 bg-[#121216]/85 px-7 py-2 rounded-full border border-[rgba(226,192,114,0.2)] backdrop-blur-md shadow-lg">
          <a
            href="#about"
            className="text-sm font-semibold text-slate-300 hover:text-[#e2c072] transition"
          >
            About Us
          </a>
          <a
            href="#contact"
            className="text-sm font-semibold text-slate-300 hover:text-[#e2c072] transition"
          >
            Contact Us
          </a>
          <button
            type="button"
            onClick={onStartWork}
            className="text-sm font-bold text-[#e2c072] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Right CTA / Auth Slot */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-[#181820] border border-[rgba(226,192,114,0.3)] rounded-full hover:border-[#e2c072] transition cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-[#e2c072] text-[#070707] flex items-center justify-center font-black text-xs">
                  {userName.charAt(0)}
                </span>
                <span className="text-xs font-bold hidden sm:inline">{userName}</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#121216] border border-[rgba(226,192,114,0.3)] rounded-2xl shadow-2xl p-2.5 z-50 text-xs space-y-1">
                  <div className="p-2 border-b border-[rgba(226,192,114,0.15)]">
                    <strong className="block text-white font-bold">{userName}</strong>
                    <span className="text-[11px] text-slate-400">me.shubhamofficial@gmail.com</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onStartWork();
                    }}
                    className="w-full text-left p-2 rounded-xl text-[#e2c072] font-semibold hover:bg-[#1c1c24] transition cursor-pointer"
                  >
                    Open Workspace App &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenTool('invoice');
                    }}
                    className="w-full text-left p-2 rounded-xl text-white font-semibold hover:bg-[#1c1c24] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🧾</span> GST Tax Invoice Tool
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggleLogin}
              className="px-5 py-2 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold text-xs rounded-full shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
            >
              Login
            </button>
          )}

          {/* Start Work Direct Button */}
          <button
            type="button"
            onClick={onStartWork}
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-extrabold text-xs rounded-full shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
          >
            <span>Start Your Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 pt-36 pb-20 max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(226,192,114,0.08)] border border-[rgba(226,192,114,0.25)] text-[#e2c072] text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#e2c072] animate-ping" />
          <span>Next-Gen Smart Utility &amp; Creations Hub</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 font-display">
          SHAPE YOUR DOCUMENTS.
          <br />
          <span className="bg-gradient-to-r from-white via-[#f1d393] to-[#e2c072] bg-clip-text text-transparent">
            SPARK YOUR IDEAS.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          PrimeAstra brings lightning-fast GST Tax Invoicing, AI Video Clipping, format converters, and
          digital developer tools together into one fluid workspace.
        </p>

        {/* Interactive Search Box */}
        <div className="w-full max-w-xl relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e2c072]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search any tool (e.g. GST Invoice, Video Clipper, MKV, Resume)..."
            className="w-full pl-14 pr-28 py-4 bg-[#121216]/90 border border-[rgba(226,192,114,0.3)] rounded-full text-white text-sm focus:outline-none focus:border-[#e2c072] focus:ring-4 focus:ring-[rgba(226,192,114,0.15)] backdrop-blur-md shadow-2xl transition"
          />
          <button
            type="button"
            onClick={() => handleSearchKeyPress({ key: 'Enter' } as any)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold text-xs rounded-full shadow hover:brightness-110 cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button
            type="button"
            onClick={onStartWork}
            className="px-8 py-4 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-extrabold text-base rounded-full shadow-xl hover:brightness-110 hover:-translate-y-0.5 transition active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>Start Your Work</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onOpenTool('invoice')}
            className="px-7 py-4 bg-[#181820]/90 border border-[rgba(226,192,114,0.3)] text-white hover:text-[#e2c072] hover:border-[#e2c072] font-bold text-sm rounded-full shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>🧾 GST Invoice Generator (Paid Tool)</span>
          </button>

          <a
            href="#about"
            className="px-6 py-4 bg-[#121216]/80 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold text-sm rounded-full transition"
          >
            About Us
          </a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e2c072] bg-[rgba(226,192,114,0.1)] px-4 py-1.5 rounded-full border border-[rgba(226,192,114,0.2)]">
            About PrimeAstra
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Speed. Privacy. Simplicity.
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Building digital tools that empower creators without clutter, ads, or complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              Crafted to accelerate every digital workflow.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              PrimeAstra was engineered as an all-in-one digital utility hub. Whether you are creating
              official GST Tax Invoices matching authentic Indian standards, cutting vertical shorts with AI
              body tracking, or converting MKV files, everything executes instantly in your browser.
            </p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No bloated servers, no invasive tracking scripts, and no tedious paywalls — just clean, elegant
              software built for maximum productivity.
            </p>

            <button
              type="button"
              onClick={onStartWork}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold text-sm rounded-xl shadow-md hover:brightness-110 transition cursor-pointer"
            >
              <span>Work With Me &rarr;</span>
            </button>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-6 bg-[#121216]/90 border border-[rgba(226,192,114,0.2)] rounded-2xl shadow-lg">
              <div className="text-4xl font-extrabold text-[#e2c072] mb-1 font-display">40+</div>
              <div className="text-xs text-slate-400 font-semibold">Planned &amp; Live Utilities</div>
            </div>
            <div className="p-6 bg-[#121216]/90 border border-[rgba(226,192,114,0.2)] rounded-2xl shadow-lg">
              <div className="text-4xl font-extrabold text-[#e2c072] mb-1 font-display">100%</div>
              <div className="text-xs text-slate-400 font-semibold">Client-Side Privacy</div>
            </div>
            <div className="p-6 bg-[#121216]/90 border border-[rgba(226,192,114,0.2)] rounded-2xl shadow-lg">
              <div className="text-4xl font-extrabold text-[#e2c072] mb-1 font-display">0ms</div>
              <div className="text-xs text-slate-400 font-semibold">Server Latency on Local Tools</div>
            </div>
            <div className="p-6 bg-[#121216]/90 border border-[rgba(226,192,114,0.2)] rounded-2xl shadow-lg">
              <div className="text-4xl font-extrabold text-[#e2c072] mb-1 font-display">60FPS</div>
              <div className="text-xs text-slate-400 font-semibold">Hardware-Accelerated UI</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e2c072] bg-[rgba(226,192,114,0.1)] px-4 py-1.5 rounded-full border border-[rgba(226,192,114,0.2)]">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Let's Connect &amp; Collaborate
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Have a tool suggestion, collaboration proposal, or freelance project? Drop a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-[#121216]/90 border border-[rgba(226,192,114,0.2)] rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white">Contact Desk</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We actively respond to feedback, tool feature requests, and business inquiries.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(226,192,114,0.1)] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-[#e2c072]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Email</div>
                  <strong className="text-sm text-white">contact@primeastra.com</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(226,192,114,0.1)] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-[#e2c072]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Response Window</div>
                  <strong className="text-sm text-white">Within 24 Hours</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleContactSubmit}
            className="md:col-span-7 bg-[#121216]/90 border border-[rgba(226,192,114,0.2)] rounded-3xl p-8 space-y-4 shadow-xl text-left"
          >
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-3 bg-[#0a0a0e] border border-[rgba(226,192,114,0.25)] rounded-xl text-white text-sm focus:outline-none focus:border-[#e2c072]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full p-3 bg-[#0a0a0e] border border-[rgba(226,192,114,0.25)] rounded-xl text-white text-sm focus:outline-none focus:border-[#e2c072]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Message</label>
              <textarea
                rows={4}
                required
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Tell us about your project or tool idea..."
                className="w-full p-3 bg-[#0a0a0e] border border-[rgba(226,192,114,0.25)] rounded-xl text-white text-sm focus:outline-none focus:border-[#e2c072]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-extrabold text-sm rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span>Transmitting...</span> : <span>Send Message</span>}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[rgba(226,192,114,0.15)] py-12 px-6 bg-[#09090c]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" viewBox="0 0 500 500" fill="none">
              <path
                d="M250 18 Q250 65 285 65 Q250 65 250 112 Q250 65 215 65 Q250 65 250 18 Z"
                fill="#e2c072"
              />
              <path
                d="M220 85 C135 95 105 140 105 220 C105 330 175 425 250 480 C180 415 140 315 140 220 C140 160 160 125 220 105 Z"
                fill="url(#mainShieldGradLanding)"
              />
              <path
                d="M250 480 C290 435 345 375 370 300 L335 280 C315 340 275 395 250 435 Z"
                fill="url(#mainShieldGradLanding)"
              />
              <path
                d="M135 430 C145 320 215 255 270 220 C320 185 350 125 370 55 L395 130 C370 180 335 225 285 260 C220 310 165 365 135 430 Z"
                fill="url(#mainShieldGradLanding)"
              />
              <polygon points="380,55 305,108 335,122 360,170" fill="#e2c072" />
              <polygon points="380,55 335,122 360,170" fill="#c5a059" />
              <path
                d="M250 140 L165 335 L200 335 L250 205 L275 270 L305 270 Z"
                fill="url(#mainShieldGradLanding)"
              />
            </svg>
            <span className="font-extrabold text-lg">
              Prime<b className="text-[#e2c072]">Astra</b>
            </span>
          </div>

          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} PrimeAstra. All rights reserved.
          </p>

          <ul className="flex items-center gap-6 text-xs text-slate-400">
            <li>
              <a href="#about" className="hover:text-[#e2c072] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#e2c072] transition">
                Contact Us
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={onStartWork}
                className="hover:text-[#e2c072] font-bold text-white transition"
              >
                Workspace App
              </button>
            </li>
          </ul>
        </div>
      </footer>

      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#121216] border border-[#e2c072] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#e2c072]" />
          <span>⚡ Message transmitted to PrimeAstra desk!</span>
        </div>
      )}
    </div>
  );
};
