<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PrimeAstra - Workspace</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #ECEEF3;
    }
    .clay-sphere {
      background: radial-gradient(circle at 35% 35%, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.15) 60%, transparent 80%);
    }
    .glass-disc {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1));
      border: 1px solid rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
    }
    .shadow-floating {
      box-shadow: 0 25px 60px -15px rgba(100, 116, 139, 0.25);
    }
  </style>
</head>
<body class="text-slate-800 min-h-screen relative overflow-x-hidden p-2 sm:p-4 md:p-6 pb-20 md:pb-6 flex items-center justify-center">

  <!-- Background Lights -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute -top-12 -right-8 w-72 h-72 rounded-full clay-sphere opacity-45 blur-[1px]"></div>
    <div class="absolute top-28 right-24 w-44 h-44 rounded-full glass-disc opacity-60"></div>
    <div class="absolute bottom-6 -left-12 w-64 h-64 rounded-full clay-sphere opacity-50 blur-[1.5px]"></div>
  </div>

  <!-- Master Application Shell -->
  <main class="relative z-10 w-full max-w-[1360px] bg-white/80 backdrop-blur-2xl rounded-[28px] md:rounded-[36px] shadow-floating border border-white/95 p-3.5 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[620px]">
    
    <!-- === LEFT SIDEBAR === -->
    <aside class="hidden md:flex md:col-span-4 lg:col-span-3 flex-col justify-start bg-[#F8FAFC]/90 rounded-[28px] p-5 border border-slate-200/70 shadow-sm">
      <div class="space-y-6">
        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-3 px-2 pt-1 cursor-pointer">
          <svg class="w-10 h-10 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]" viewBox="0 0 500 500" fill="none">
            <defs>
              <linearGradient id="paGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f2fe" />
                <stop offset="50%" stop-color="#8b5cf6" />
                <stop offset="100%" stop-color="#6d28d9" />
              </linearGradient>
              <linearGradient id="paStarLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="60%" stop-color="#a78bfa" />
                <stop offset="100%" stop-color="#7c3aed" />
              </linearGradient>
            </defs>
            <path d="M250 18 Q250 65 285 65 Q250 65 250 112 Q250 65 215 65 Q250 65 250 18 Z" fill="url(#paStarLight)" />
            <path d="M220 85 C135 95 105 140 105 220 C105 330 175 425 250 480 C180 415 140 315 140 220 C140 160 160 125 220 105 Z" fill="url(#paGradLight)" />
            <path d="M280 85 C310 92 340 108 355 125 L328 148 C315 135 295 120 280 115 Z" fill="url(#paGradLight)" />
            <path d="M250 480 C290 435 345 375 370 300 L335 280 C315 340 275 395 250 435 Z" fill="url(#paGradLight)" />
            <path d="M135 430 C145 320 215 255 270 220 C320 185 350 125 370 55 L395 130 C370 180 335 225 285 260 C220 310 165 365 135 430 Z" fill="url(#paGradLight)" />
            <polygon points="380,55 305,108 335,122 360,170" fill="url(#paStarLight)" />
            <polygon points="380,55 335,122 360,170" fill="#6d28d9" />
            <path d="M250 140 L165 335 L200 335 L250 205 L275 270 L305 270 Z" fill="url(#paGradLight)" />
          </svg>
          <div>
            <h1 class="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Prime<span class="text-purple-600">Astra</span>
            </h1>
            <span class="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5 block">AI &amp; Wasm Suite</span>
          </div>
        </a>

        <!-- Sidebar Buttons (Same Style) -->
        <nav class="space-y-2">
          <!-- 1. Home Tab Button -->
          <button id="navHomeBtn" onclick="switchMainTab('home')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-slate-600 hover:text-slate-900 hover:bg-white/60 text-left">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Home</span>
          </button>

          <!-- 2. Free Tools Tab Button (Matches Home button style) -->
          <button id="navFreeToolsBtn" onclick="switchMainTab('tools')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all bg-white text-purple-700 shadow-sm border border-purple-100/80 text-left">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>
            <span>Free Tools</span>
          </button>
        </nav>
      </div>
    </aside>

    <!-- === RIGHT DASHBOARD === -->
    <section class="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col justify-start space-y-4 h-full">
      <!-- Top Bar -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 shrink-0">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Prime<span class="text-purple-600">Astra</span>
          </h2>
          <p id="userGreeting" class="text-[11px] sm:text-xs text-slate-500 font-medium">All tools. One place.</p>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="relative flex-1 sm:w-72">
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search tools..." class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          </div>

          <div id="authSlot">
            <!-- Firebase Login or Profile Avatar here -->
          </div>
        </div>
      </header>

      <!-- Main Central View Area -->
      <div class="flex-1 w-full rounded-[24px] md:rounded-[28px] bg-white/60 border border-white/90 backdrop-blur-md p-3 sm:p-5 flex flex-col items-center justify-start text-center relative shadow-sm min-h-0">
        
        <!-- ==============================================
             1. FREE TOOLS CARD DIRECTORY VIEW (Initial Screen)
             ============================================== -->
        <div id="toolsDirectoryView" class="w-full text-left space-y-4">
          <div class="border-b border-slate-200/80 pb-3 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Free Tools</h3>
              <p class="text-xs text-slate-500">Fast, local, and 100% free client-side utilities.</p>
            </div>
            <span class="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg">
              1 Tool Live
            </span>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            
            <!-- AI Resume Maker Box/Card -->
            <div onclick="openResumeMakerTool()" class="group bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between">
              <div class="flex items-start gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-bold text-slate-800 leading-snug group-hover:text-purple-600 transition truncate">
                    AI Resume Maker
                  </h4>
                  <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    Build job-ready resumes with 3 templates, live preview &amp; instant PDF download.
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[10px]">
                <span class="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                  Career &amp; Docs
                </span>
                <span class="text-purple-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Open &rarr;
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- ==============================================
             2. RESUME MAKER WORKSPACE VIEW (Opens after card click)
             ============================================== -->
        <div id="resumeMakerView" class="w-full hidden text-left space-y-4">
          <!-- Top Tool Banner with Back Arrow -->
          <div class="p-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-sm">
            <div class="flex items-center gap-3">
              <button onclick="switchMainTab('tools')" class="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition cursor-pointer" title="Back to Tools">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <div>
                <h2 class="text-base font-bold flex items-center gap-2">
                  <span>✨</span> AI Resume Maker
                </h2>
                <p class="text-[11px] text-purple-100">Live preview &amp; printable PDF ready</p>
              </div>
            </div>

            <button onclick="window.print()" class="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition cursor-pointer w-full sm:w-auto">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download PDF / Print</span>
            </button>
          </div>

          <!-- Inputs & Preview Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <!-- Left Inputs -->
            <div class="lg:col-span-6 space-y-4">
              <!-- Template & Color Selector -->
              <div class="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-xs">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="font-bold text-slate-700">Select Template:</span>
                  <div class="flex items-center gap-1.5">
                    <button type="button" onclick="setResumeTemplate('modern')" id="tmplBtnModern" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-600 text-white shadow-xs">Modern</button>
                    <button type="button" onclick="setResumeTemplate('classic')" id="tmplBtnClassic" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Classic</button>
                    <button type="button" onclick="setResumeTemplate('executive')" id="tmplBtnExecutive" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Executive</button>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-slate-600">Theme Color:</span>
                    <input type="color" id="resumeThemeColor" value="#1e3a8a" onchange="renderResumePreview()" class="w-7 h-7 rounded-lg border-0 cursor-pointer" />
                  </div>
                  <button type="button" onclick="location.reload()" class="text-slate-500 hover:text-slate-800 text-xs">Reset</button>
                </div>
              </div>

              <!-- Personal Details -->
              <div class="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 class="text-xs font-bold text-slate-800 border-b pb-1">Personal Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label class="text-[10px] font-semibold text-slate-500">Full Name</label>
                    <input type="text" id="rName" value="Shubham Singh" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                  </div>
                  <div>
                    <label class="text-[10px] font-semibold text-slate-500">Job Title / Post</label>
                    <input type="text" id="rTitle" value="Computer Operator & Executive" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                  </div>
                  <div>
                    <label class="text-[10px] font-semibold text-slate-500">Mobile</label>
                    <input type="text" id="rPhone" value="+91 9876543210" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                  </div>
                  <div>
                    <label class="text-[10px] font-semibold text-slate-500">Email</label>
                    <input type="email" id="rEmail" value="shubham@example.com" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="text-[10px] font-semibold text-slate-500">Address</label>
                    <input type="text" id="rAddress" value="Roorkee, Uttarakhand" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="text-[10px] font-semibold text-slate-500">Profile Summary</label>
                    <textarea rows="2" id="rSummary" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs">Dedicated professional with hands-on experience in computer operations, digital documentation, and online client management.</textarea>
                  </div>
                </div>
              </div>

              <!-- Skills & Languages -->
              <div class="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h3 class="text-xs font-bold text-slate-800 border-b pb-1">Skills &amp; Languages</h3>
                <div>
                  <label class="text-[10px] font-semibold text-slate-500">Skills (comma separated)</label>
                  <input type="text" id="rSkills" value="MS Office, Data Entry, Computer Operations, Typing, Documentation" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                </div>
                <div>
                  <label class="text-[10px] font-semibold text-slate-500">Languages</label>
                  <input type="text" id="rLanguages" value="Hindi, English" oninput="renderResumePreview()" class="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
                </div>
              </div>
            </div>

            <!-- Right Live Preview -->
            <div class="lg:col-span-6 bg-slate-200/70 p-2 sm:p-3 rounded-2xl border border-slate-300 flex justify-center lg:sticky lg:top-0 w-full overflow-x-auto">
              <div id="resumePreviewContainer" class="w-full min-w-[340px]">
                <!-- Dynamic Resume HTML -->
              </div>
            </div>
          </div>
        </div>

        <!-- ==============================================
             3. HOME VIEW
             ============================================== -->
        <div id="homeView" class="w-full hidden">
          <div class="m-auto p-8 max-w-md bg-white/90 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 class="text-base font-bold text-slate-800">Welcome to PrimeAstra Hub</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Explore your collection of digital utilities by opening <strong>Free Tools</strong>.
            </p>
            <button onclick="switchMainTab('tools')" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
              Explore Free Tools &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>
  </main>

  <!-- Mobile Floating Bottom Bar -->
  <div class="fixed bottom-3 left-8 right-8 z-40 md:hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2 shadow-floating flex items-center justify-around">
    <button onclick="switchMainTab('home')" class="flex-1 flex flex-col items-center gap-1 py-1.5 text-slate-500">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      <span class="text-[11px]">Home</span>
    </button>
    <button onclick="switchMainTab('tools')" class="flex-1 flex flex-col items-center gap-1 py-1.5 text-purple-700 font-bold bg-purple-50 rounded-xl">
      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>
      <span class="text-[11px]">Free Tools</span>
    </button>
  </div>

  <!-- SCRIPT -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyA4mMH0LMAvN_vuCLCdYR3tGZHdmbq7iMM",
      authDomain: "primeastra-643ac.firebaseapp.com",
      projectId: "primeastra-643ac",
      storageBucket: "primeastra-643ac.firebasestorage.app",
      messagingSenderId: "756871848434",
      appId: "1:756871848434:web:07c5220d2a84a026190b6b",
      measurementId: "G-R8H0S5LW8N"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const provider = new GoogleAuthProvider();

    const authSlot = document.getElementById('authSlot');
    const userGreeting = document.getElementById('userGreeting');

    window.handleGoogleLogin = async () => {
      try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, { uid: user.uid, name: user.displayName || 'User', email: user.email, photoUrl: user.photoURL || '', createdAt: new Date().toISOString() });
        }
      } catch (e) {
        alert(e.message);
      }
    };

    window.handleLogout = () => signOut(auth);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let photo = user.photoURL;
        let name = user.displayName || user.email.split('@')[0];
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().photoUrl) photo = snap.data().photoUrl;
        } catch (e) {}

        if (!photo) {
          photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name[0])}&background=7c3aed&color=fff&bold=true&rounded=true`;
        }

        userGreeting.innerHTML = `Welcome back, <span class="font-bold text-purple-700">${name}</span>`;
        authSlot.innerHTML = `
          <div class="flex items-center gap-2 bg-white border border-slate-200 p-1 pr-3 rounded-full shadow-xs">
            <img src="${photo}" class="w-8 h-8 rounded-full object-cover" />
            <button onclick="handleLogout()" class="text-xs text-rose-500 font-bold hover:underline cursor-pointer">Logout</button>
          </div>
        `;
      } else {
        userGreeting.innerText = 'All tools. One place.';
        authSlot.innerHTML = `
          <button onclick="handleGoogleLogin()" class="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer">
            <span>Login / Register</span>
          </button>
        `;
      }
    });

    window.activeResumeTemplate = 'modern';

    window.switchMainTab = (tab) => {
      const toolsView = document.getElementById('toolsDirectoryView');
      const resumeView = document.getElementById('resumeMakerView');
      const homeView = document.getElementById('homeView');
      const navHome = document.getElementById('navHomeBtn');
      const navTools = document.getElementById('navFreeToolsBtn');

      toolsView.classList.add('hidden');
      resumeView.classList.add('hidden');
      homeView.classList.add('hidden');

      if (tab === 'home') {
        homeView.classList.remove('hidden');
        navHome.className = "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all bg-white text-purple-700 shadow-sm border border-purple-100/80 text-left";
        navTools.className = "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-slate-600 hover:text-slate-900 hover:bg-white/60 text-left";
      } else {
        toolsView.classList.remove('hidden');
        navTools.className = "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all bg-white text-purple-700 shadow-sm border border-purple-100/80 text-left";
        navHome.className = "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-slate-600 hover:text-slate-900 hover:bg-white/60 text-left";
      }
    };

    window.openResumeMakerTool = () => {
      document.getElementById('toolsDirectoryView').classList.add('hidden');
      document.getElementById('resumeMakerView').classList.remove('hidden');
      renderResumePreview();
    };

    window.setResumeTemplate = (tmpl) => {
      window.activeResumeTemplate = tmpl;
      ['modern', 'classic', 'executive'].forEach(t => {
        const btn = document.getElementById(`tmplBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (t === tmpl) {
          btn.className = "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-600 text-white shadow-xs";
        } else {
          btn.className = "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200";
        }
      });
      renderResumePreview();
    };

    window.renderResumePreview = () => {
      const name = document.getElementById('rName').value || 'Your Name';
      const title = document.getElementById('rTitle').value || 'Professional Title';
      const phone = document.getElementById('rPhone').value || '+91 0000000000';
      const email = document.getElementById('rEmail').value || 'email@example.com';
      const address = document.getElementById('rAddress').value || 'City, Country';
      const summary = document.getElementById('rSummary').value || '';
      const skills = document.getElementById('rSkills').value || '';
      const languages = document.getElementById('rLanguages').value || '';
      const color = document.getElementById('resumeThemeColor').value || '#1e3a8a';
      const container = document.getElementById('resumePreviewContainer');

      const skillPills = skills.split(',').map(s => `<span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-size: 8px;">${s.trim()}</span>`).join(' ');

      if (window.activeResumeTemplate === 'modern') {
        container.innerHTML = `
          <div class="w-full bg-white shadow-md rounded-lg overflow-hidden flex min-h-[520px] text-slate-800" style="font-family: sans-serif;">
            <div class="w-1/3 text-white p-4 flex flex-col justify-between" style="background-color: ${color}">
              <div class="space-y-4">
                <div>
                  <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">Contact</h4>
                  <div class="space-y-1.5 text-[9px] text-white/90">
                    <p class="break-all">📞 ${phone}</p>
                    <p class="break-all">✉️ ${email}</p>
                    <p>📍 ${address}</p>
                  </div>
                </div>
                <div>
                  <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">Skills</h4>
                  <div class="flex flex-wrap gap-1">${skillPills}</div>
                </div>
                <div>
                  <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">Languages</h4>
                  <p class="text-[9px] text-white/90">${languages}</p>
                </div>
              </div>
              <div class="text-[8px] text-white/50 pt-3">PrimeAstra Suite</div>
            </div>
            <div class="w-2/3 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div class="border-b pb-2 mb-3">
                  <h1 class="text-xl font-black" style="color: ${color}">${name}</h1>
                  <p class="text-xs font-bold text-slate-500 uppercase">${title}</p>
                  <p class="text-[10px] text-slate-600 mt-1.5 leading-relaxed">${summary}</p>
                </div>
                <div class="mb-3">
                  <h3 class="text-xs font-bold uppercase mb-1 pb-0.5 border-b border-slate-200" style="color: ${color}">Experience</h3>
                  <div class="text-[10px] flex justify-between font-bold"><span>Computer Operator</span><span class="text-slate-400 font-normal">2021 - Present</span></div>
                  <p class="text-[9px] text-slate-500">Digital Seva Center</p>
                </div>
                <div>
                  <h3 class="text-xs font-bold uppercase mb-1 pb-0.5 border-b border-slate-200" style="color: ${color}">Education</h3>
                  <div class="text-[10px] flex justify-between font-bold"><span>12th (Commerce)</span><span class="text-slate-400 font-normal">2016</span></div>
                  <p class="text-[9px] text-slate-500">DAV Inter College, UP Board | First Division</p>
                </div>
              </div>
              <div class="border-t pt-2 text-[8px] text-slate-400">Verified Client Document</div>
            </div>
          </div>
        `;
      } else if (window.activeResumeTemplate === 'classic') {
        container.innerHTML = `
          <div class="w-full bg-white shadow-md rounded-lg p-5 flex flex-col justify-between min-h-[520px] text-slate-800" style="font-family: serif;">
            <div>
              <div class="text-center border-b pb-3 mb-3">
                <h1 class="text-xl font-bold tracking-tight text-slate-900">${name}</h1>
                <p class="text-xs font-semibold text-slate-600 uppercase mt-0.5">${title}</p>
                <p class="text-[10px] text-slate-500 mt-1">${phone} | ${email} | ${address}</p>
              </div>
              <div class="mb-3">
                <h3 class="text-[11px] font-bold uppercase border-b pb-0.5 mb-1" style="color: ${color}">Summary</h3>
                <p class="text-[10px] text-slate-600 leading-relaxed">${summary}</p>
              </div>
              <div class="mb-3">
                <h3 class="text-[11px] font-bold uppercase border-b pb-0.5 mb-1" style="color: ${color}">Experience</h3>
                <p class="text-[10px] font-bold">Computer Operator - Digital Seva Center (2021 - Present)</p>
              </div>
              <div class="mb-3">
                <h3 class="text-[11px] font-bold uppercase border-b pb-0.5 mb-1" style="color: ${color}">Education</h3>
                <p class="text-[10px]"><strong>12th Commerce</strong> - DAV Inter College (First Division)</p>
              </div>
              <div>
                <h3 class="text-[11px] font-bold uppercase border-b pb-0.5 mb-1" style="color: ${color}">Skills</h3>
                <p class="text-[10px] text-slate-700">${skills}</p>
              </div>
            </div>
            <div class="border-t pt-2 text-[8px] text-slate-400 text-center">PrimeAstra Classic Template</div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="w-full bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between min-h-[520px] text-slate-800" style="font-family: sans-serif;">
            <div>
              <div class="p-4 text-white" style="background-color: ${color}">
                <h1 class="text-lg font-black">${name}</h1>
                <p class="text-[11px] font-medium text-white/90">${title}</p>
                <p class="text-[9px] text-white/80 mt-1">📞 ${phone} | ✉️ ${email} | 📍 ${address}</p>
              </div>
              <div class="p-4 space-y-3">
                <div>
                  <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Profile</h3>
                  <p class="text-[10px] text-slate-600 leading-relaxed">${summary}</p>
                </div>
                <div>
                  <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Experience</h3>
                  <p class="text-[10px] font-bold text-slate-800">Computer Operator - Digital Seva Center</p>
                </div>
                <div>
                  <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Skills</h3>
                  <p class="text-[10px] text-slate-700">${skills}</p>
                </div>
              </div>
            </div>
            <div class="p-3 border-t text-[8px] text-slate-400 text-center">Executive Template</div>
          </div>
        `;
      }
    };
  </script>
</body>
</html>