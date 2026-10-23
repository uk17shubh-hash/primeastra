import React from 'react';
import { ResumeData } from '../ResumeMaker';

export const ModernTemplate: React.FC<{ data: ResumeData; themeColor: string }> = ({ data, themeColor }) => (
  <div className="w-full min-w-[340px] bg-white shadow-md rounded-lg overflow-hidden flex min-h-[520px] text-slate-800" style={{ fontFamily: 'sans-serif' }}>
    <div className="w-1/3 text-white p-3 sm:p-4 flex flex-col justify-between" style={{ backgroundColor: themeColor }}>
      <div className="space-y-4">
        <div>
          <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">Contact</h4>
          <div className="space-y-1.5 text-[9px] sm:text-[10px] text-white/90">
            <p className="break-all">📞 {data.phone}</p>
            <p className="break-all">✉️ {data.email}</p>
            <p>📍 {data.address}</p>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {data.skills.split(',').map((s, i) => (
              <span key={i} className="text-[8px] sm:text-[9px] bg-white/20 px-1 py-0.5 rounded text-white font-medium">
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">Languages</h4>
          <p className="text-[9px] sm:text-[10px] text-white/90">${data.languages}</p>
        </div>
      </div>
      <div className="text-[8px] text-white/50 pt-3">PrimeAstra Suite</div>
    </div>
    <div className="w-2/3 p-4 sm:p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="border-b pb-2 mb-3">
          <h1 className="text-base sm:text-xl font-black" style={{ color: themeColor }}>{data.name || 'Your Name'}</h1>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">{data.title}</p>
          {data.summary && <p className="text-[9px] sm:text-[10px] text-slate-600 mt-1.5 leading-relaxed">{data.summary}</p>}
        </div>
        {data.experience.length > 0 && (
          <div className="mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase mb-1 pb-0.5 border-b border-slate-200" style={{ color: themeColor }}>Experience</h3>
            <div className="space-y-1.5">
              {data.experience.map((exp, i) => (
                <div key={i} className="text-[9px] sm:text-[10px]">
                  <div className="flex justify-between font-bold">
                    <span>{exp.role}</span>
                    <span className="text-slate-400 font-normal">{exp.period}</span>
                  </div>
                  <p className="text-slate-500">{exp.company}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase mb-1 pb-0.5 border-b border-slate-200" style={{ color: themeColor }}>Education</h3>
            <div className="space-y-1.5">
              {data.education.map((edu, i) => (
                <div key={i} className="text-[9px] sm:text-[10px] flex justify-between">
                  <div>
                    <p className="font-bold">{edu.degree}</p>
                    <p className="text-slate-500">{edu.board}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{edu.year}</span>
                    {edu.marks && <p className="text-slate-600">{edu.marks}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="border-t pt-2 text-[8px] text-slate-400">Verified Client Document</div>
    </div>
  </div>
);