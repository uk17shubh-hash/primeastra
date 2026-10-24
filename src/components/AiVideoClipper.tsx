import React, { useState } from 'react';
import { ArrowLeft, Film, Upload, Sparkles, Download, Play } from 'lucide-react';

interface AiVideoClipperProps {
  onBack?: () => void;
}

export const AiVideoClipper: React.FC<AiVideoClipperProps> = ({ onBack }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [duration, setDuration] = useState('auto');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [credits, setCredits] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [clipGenerated, setClipGenerated] = useState(false);
  const [clipUrl, setClipUrl] = useState('');

  const BACKEND_URL = 'http://localhost:5000';

  const handleFetch = () => {
    if (!videoUrl.trim()) {
      alert('Kripya valid YouTube video link enter karein!');
      return;
    }
    alert('Video source load ho gaya hai.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateClips = async () => {
    if (!videoUrl && !selectedFile) {
      alert('Pehle YouTube URL enter karein ya MP4 file upload karein!');
      return;
    }

    if (credits < 10) {
      alert('Insufficient credits!');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (videoUrl) formData.append('url', videoUrl);
    if (selectedFile) formData.append('video', selectedFile);
    formData.append('duration', duration);
    formData.append('aspectRatio', aspectRatio);

    try {
      const response = await fetch(`${BACKEND_URL}/process-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Video processing fail ho gayi.');
      }

      setCredits((prev) => prev - 10);
      setClipUrl(`${BACKEND_URL}${data.clipUrl}`);
      setClipGenerated(true);
    } catch (err: any) {
      alert('Error: ' + err.message + '\n(Ensure backend server.py is running)');
    } finally {
      setIsLoading(false);
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Step 1: Enter Video Source</h3>
            <p className="text-xs text-slate-500">Paste any public YouTube link or upload your raw MP4 video file.</p>
          </div>

          {/* YouTube URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">YouTube Video URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtu.be/..."
                className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
              <button
                type="button"
                onClick={handleFetch}
                className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shrink-0 cursor-pointer"
              >
                Fetch
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          <div className="border-t border-slate-100 pt-3">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Or Upload MP4 File</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/60 group relative">
              <input
                type="file"
                id="fileUpload"
                accept="video/mp4,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="fileUpload" className="cursor-pointer space-y-1 block">
                <Upload className="w-8 h-8 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-700 block">
                  {selectedFile ? selectedFile.name : 'Click to upload video'}
                </span>
                <span className="text-[10px] text-slate-400 block">MP4 or MOV up to 500MB</span>
              </label>
            </div>
          </div>

          {/* Settings */}
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

          {/* Action Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerateClips}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-extrabold rounded-xl text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Processing Video (Downloading & Cropping)...' : 'Generate AI Clips (Cost: 10 Credits)'}</span>
          </button>
        </div>

        {/* Right Gallery / Player */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">GENERATED CLIPS</h4>
            <span className="text-[11px] text-slate-400">Gallery</span>
          </div>

          <div className="space-y-3 min-h-[300px] flex flex-col justify-center">
            {clipGenerated ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Clip #1: AI Highlight Short</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">Ready</span>
                </div>

                <div className="rounded-xl overflow-hidden bg-black flex justify-center items-center">
                  <video controls autoPlay loop className="w-full max-h-[360px] object-contain" src={clipUrl} />
                </div>

                <a
                  href={clipUrl}
                  download="viral_clip_9-16.mp4"
                  className="block w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download 9:16 MP4 Clip
                </a>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-100 py-12 space-y-2">
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