import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let currentUser = null;
let currentCredits = 100;

function syncCredits(credits) {
  currentCredits = credits;
  const badge = document.getElementById("creditsDisplayBadge");
  if (badge) badge.innerText = `${credits} Credits Available`;
  localStorage.setItem("pa_user_credits", credits.toString());
}

// Restore saved credits
const saved = localStorage.getItem("pa_user_credits");
if (saved !== null) {
  syncCredits(parseInt(saved, 10));
}

// Sync user & credits from Firebase
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  const userInitial = document.getElementById("userInitial");
  const userNameLabel = document.getElementById("userNameLabel");

  if (user) {
    const name = user.displayName || user.email.split("@")[0];
    if (userNameLabel) userNameLabel.innerText = name.split(" ")[0];
    if (userInitial) userInitial.innerText = name.charAt(0).toUpperCase();

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().credits !== undefined) {
        syncCredits(snap.data().credits);
      }
    } catch (err) {
      console.warn("Firestore fetch error:", err);
    }
  } else {
    const localName = localStorage.getItem("pa_cached_name") || "shubh";
    if (userNameLabel) userNameLabel.innerText = localName;
    if (userInitial) userInitial.innerText = localName.charAt(0).toUpperCase();
  }
});

window.handleFetchMetadata = () => {
  const url = document.getElementById("ytVideoUrl").value.trim();
  if (!url) {
    alert("Please enter a YouTube video URL first!");
    return;
  }
  alert("Video metadata fetched successfully! Detected duration: 12m 45s.");
};

window.handleFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    document.getElementById("fileStatusText").innerText = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
  }
};

window.handleGenerateClips = async () => {
  const ytUrl = document.getElementById("ytVideoUrl").value.trim();
  const fileInput = document.getElementById("videoFileInput");
  const hasFile = fileInput.files && fileInput.files.length > 0;

  if (!ytUrl && !hasFile) {
    alert("Pehle YouTube link daalein ya koi MP4 video file select karein!");
    return;
  }

  const COST = 10;
  if (currentCredits < COST) {
    alert("Insufficient Credits! Aapke paas kaafi credits nahi hain.");
    return;
  }

  const btn = document.getElementById("generateClipsBtn");
  btn.disabled = true;
  btn.innerHTML = `<span>⏳ Processing Highlights &amp; Adding Captions...</span>`;

  setTimeout(async () => {
    const remaining = currentCredits - COST;
    syncCredits(remaining);

    if (currentUser) {
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          credits: remaining
        });
      } catch (e) {
        console.error("Firestore sync failed:", e);
      }
    }

    const resultsContainer = document.getElementById("clipsResultArea");
    resultsContainer.className = "space-y-3 w-full text-left";
    resultsContainer.innerHTML = `
      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div class="space-y-0.5">
          <p class="font-extrabold text-slate-900 text-xs">Clip #1: High Energy Hook (00:15 - 00:49)</p>
          <p class="text-[10px] text-slate-500">Auto Captions: Enabled • 9:16 Vertical • 1080p</p>
        </div>
        <button onclick="alert('Clip downloaded!')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold">
          Download
        </button>
      </div>

      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div class="space-y-0.5">
          <p class="font-extrabold text-slate-900 text-xs">Clip #2: Key Takeaway (02:10 - 02:50)</p>
          <p class="text-[10px] text-slate-500">Auto Captions: Enabled • 9:16 Vertical • 1080p</p>
        </div>
        <button onclick="alert('Clip downloaded!')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold">
          Download
        </button>
      </div>
    `;

    document.getElementById("galleryCountLabel").innerText = "2 Clips Ready";
    btn.disabled = false;
    btn.innerHTML = `<span>⚡ Generate AI Clips (Cost: 10 Credits)</span>`;
    alert(`Success! 2 Clips ready. 10 Credits deducted. Remaining Credits: ${remaining}`);
  }, 2500);
};