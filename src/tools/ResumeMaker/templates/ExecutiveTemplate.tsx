import React from 'react';
import { ResumeData } from '../ResumeMaker';

export const ExecutiveTemplate: React.FC<{ data: ResumeData; themeColor: string }> = ({ data, themeColor }) => (
  <div
    className="w-full min-w-[340px] bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between min-h-[520px] text-slate-800"
    style={{ fontFamily: 'sans-serif' }}
  >
    <div>
      <div className="p-4 text-white" style={{ backgroundColor: themeColor }}>
        <h1 className="text-lg font-black">{data.name}</h1>
        <p className="text-[11px] font-medium text-white/90">{data.title}</p>
        <div className="flex flex-wrap gap-x-3 text-[9px] text-white/80 mt-2">
          <span>📞 {data.phone}</span>
          <span>✉️ {data.email}</span>
          <span>📍 {data.address}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {data.summary && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Profile</h3>
            <p className="text-[10px] text-slate-600 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Experience</h3>
            <div className="space-y-1.5">
              {data.experience.map((exp, i) => (
                <div key={i} className="text-[10px] border-l-2 pl-2" style={{ borderColor: themeColor }}>
                  <div className="flex justify-between font-bold text-slate-800">
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
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Education</h3>
            <div className="space-y-1">
              {data.education.map((edu, i) => (
                <div key={i} className="text-[10px] flex justify-between">
                  <span className="font-semibold text-slate-700">{edu.degree} - {edu.board}</span>
                  <span className="text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-1 border-t border-slate-100 flex justify-between text-[9px] text-slate-600">
          <span><strong>Skills:</strong> {data.skills}</span>
          <span><strong>Languages:</strong> {data.languages}</span>
        </div>
      </div>
    </div>

    <div className="p-3 border-t text-[8px] text-slate-400 text-center">
      Verified &amp; Certified
    </div>
  </div>
);