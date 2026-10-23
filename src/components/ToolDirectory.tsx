import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

interface ToolDirectoryProps {
  onSelectTool: (toolId: string) => void;
}

export const ToolDirectory: React.FC<ToolDirectoryProps> = ({ onSelectTool }) => {
  return (
    <div className="w-full text-left space-y-4">
      <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Free Tools</h3>
          <p className="text-xs text-slate-500">Fast, local, and 100% free client-side utilities.</p>
        </div>
        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg">
          1 Tool Available
        </span>
      </div>

      {/* Grid containing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {/* Card: AI Resume Maker */}
        <div
          onClick={() => onSelectTool('resume-maker')}
          className="group bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-purple-600 transition truncate">
                AI Resume Maker
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                Build job-ready resumes with 3 templates, live preview &amp; instant PDF download.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[10px]">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
              Career &amp; Docs
            </span>
            <span className="text-purple-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Open <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Future tools ke cards yahan aasaani se add ho jayenge */}
      </div>
    </div>
  );
};