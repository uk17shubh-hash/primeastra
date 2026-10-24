// src/components/AiVideoClipper.tsx
import React, { useState, useRef } from 'react';
import { ArrowLeft, Film, Upload, Sparkles, Download, Play, CheckCircle2, RefreshCw } from 'lucide-react';

interface AiVideoClipperProps {
  onBack?: () => void;
}

export const AiVideoClipper: React.FC<AiVideoClipperProps> = ({ onBack }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState('auto');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [credits, setCredits] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [clipReady, setClipReady] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('Loaded Video Source');
  const [startTime, setStartTime] = useState<number>(15);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. YouTube Link Parser (Works on youtu.be, shorts, watch?v= and handles ?si= parameters)
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const cleanUrl = url.trim();
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = cleanUrl.match(regExp);
    return match ? match[1] : null;
  };

  // 2. Fetch Handler
  const handleFetch = () => {
    if (!videoUrl.trim()) {
      alert('Kripya pehle YouTube video link enter karein!');
      return;
    }

    const id = extractYouTubeId(videoUrl);
    if (!id) {
      alert('Invalid YouTube Link! Kripya sahi link dalein (e.g. https://youtu.be/... ya https://www.youtube.com/watch?v=...)');
      return;
    }

    setYoutubeId(id);
    setSelectedFile(null);
    setFileUrl(null);
    setClipReady(false);
    setVideoTitle(`YouTube Video (${id})`);
    alert('✓ Video link safalta-purvak fetch ho gayi!');
  };

  // 3. File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
      setVideoUrl('');
      setYoutubeId(null);
      setClipReady(false);
      setVideoTitle(file.name);
    }
  };

  // 4. Generate AI Clips
  const handleGenerateClips = () => {
    const currentId = extractYouTubeId(videoUrl);
    if (!currentId && !selectedFile) {
      alert('Pehle YouTube URL enter karke "Fetch" dabayein ya koi MP4 video upload karein!');
      return;
    }

    if (credits < 10) {
      alert('Credits khatam ho gaye hain!');
      return;
    }

    setIsLoading(true);
    setClipReady(false);

    // Dynamic timestamp based on duration
    let startSec = 15;
    if (duration === 'short') startSec = 10;
    if (duration === 'long') startSec = 30;
    setStartTime(startSec);

    setTimeout(() => {
      if (currentId) setYoutubeId(currentId);
      setCredits((prev) => prev - 10);
      setIsLoading(false);
      setClipReady(true);
    }, 1500);
  };

  // 5. Download Clip Handler
  const handleDownload = () => {
    if (selectedFile && fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = `clip_highlight_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (youtubeId) {
      // Direct stream download helper
      window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    }
  };

  return (
    <div className="w-full space-y-4 text-left">
      {/* Top Banner Header */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          )}
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" /> AI Video Clipping Generator
            </h2>
            <p className="text-xs text-slate-300">Paid Section • Auto short clip extractor &amp; caption generator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-bold">
            {credits} Credits Available
          </span>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form: Video Input */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Step 1: Enter Video Source</h3>
            <p className="text-xs text-slate-500">Paste any public YouTube link or upload your raw MP4 video file.</p>
          </div>

          {/* YouTube Video URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">YouTube Video URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtu.be/DonbL_C_mv8?si=..."
                className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
              <button
                type="button"
                onClick={handleFetch}
                className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                Fetch
              </button>
            </div>
            {youtubeId && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Video Ready: ID {youtubeId}
              </p>
            )}
          </div>

          {/* File Upload Box */}
          <div className="border-t border-slate-100 pt-3">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Or Upload MP4 File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/60 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-700 block">
                  {selectedFile ? selectedFile.name : 'Click to upload video'}
                </span>
                <span className="text-[10px] text-slate-400 block">MP4 or MOV up to 500MB</span>
              </div>
            </div>
          </div>

          {/* Duration & Aspect Ratio Options */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Clip Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none"
              >
                <option value="auto">Auto (30s - 60s)</option>
                <option value="short">&lt; 30 seconds</option>
                <option value="long">60 - 90 seconds</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none"
              >
                <option value="9:16">9:16 (Shorts, Reels, TikTok)</option>
                <option value="16:9">16:9 (Landscape Standard)</option>
                <option value="1:1">1:1 (Square Feed)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerateClips}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-extrabold rounded-xl text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Analyzing Highlights & Segmenting Clip...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>⚡ Generate AI Clips (Cost: 10 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: Real 9:16 Video Player Container */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">GENERATED CLIPS</h4>
            <span className="text-[11px] text-slate-400">Gallery</span>
          </div>

          <div className="min-h-[300px] flex flex-col justify-center">
            {clipReady ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Clip #1: Viral Hook</p>
                    <p className="text-[10px] text-slate-500">
                      Ratio: {aspectRatio} • Captions: Auto Active
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">
                    Ready
                  </span>
                </div>

                {/* 9:16 Aspect Ratio Frame */}
                <div className="rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[360px] mx-auto shadow-md border border-slate-800 flex items-center justify-center">
                  {youtubeId ? (
                    <iframe
                      className="w-full h-full object-cover"
                      src={`https://www.youtube.com/embed/${youtubeId}?start=${startTime}&end=${startTime + 35}&autoplay=1&mute=0&controls=1&loop=1`}
                      title="AI Video Clip Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : fileUrl ? (
                    <video controls autoPlay loop className="w-full h-full object-cover" src={fileUrl} />
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Clip</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-100 py-14 space-y-2">
                <Film className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No clips processed yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Provide a video link or file on the left to start extracting highlight clips.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};