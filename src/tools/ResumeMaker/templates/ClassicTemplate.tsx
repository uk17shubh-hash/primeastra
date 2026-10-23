import React from 'react';
import { ResumeData } from '../ResumeMaker';

export const ClassicTemplate: React.FC<{ data: ResumeData; themeColor: string }> = ({ data, themeColor }) => (
  <div className="w-full min-w-[340px] bg-white shadow-md rounded-lg p-5 flex flex-col justify-between min-h-[520px] text-slate-800" style={{ fontFamily: 'serif' }}>
    <div>
      <div className="text-center border-b pb-3 mb-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{data.name || 'Your Name'}</h1>
        <p className="text-xs font-semibold text-slate-600 uppercase mt-0.5">{data.title}</p>
        <p className="text-[10px] text-slate-500 mt-1">{data.phone} | {data.email} | {data.address}</p>
      </div>
      {data.summary && (
        <div className="mb-3">
          <h3 className="text-[11px] font-bold uppercase border-b pb-0.5 mb-1" style={{ color: themeColor }}>Summary</h3>
          <p className="text-[10px] text-slate-600 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {data.experience.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[11px] font-bold uppercase border-b pb-0.5 mb-1.5" style={{ color: themeColor }}>Work Experience</h3>
          <div className="space-y-2">
            {data.experience.map((exp, i) => (
              <div key={i} className="text-[10px]">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{exp.role} - {exp.company}</span>
                  <span className="text-slate-400 font-normal">{exp.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.education.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[11px] font-bold uppercase border-b pb-0.5 mb-1.5" style={{ color: themeColor }}>Education</h3>
          <div className="space-y-1.5">
            {data.education.map((edu, i) => (
              <div key={i} className="text-[10px] flex justify-between">
                <span><strong>{edu.degree}</strong> ({edu.board})</span>
                <span className="text-slate-500">{edu.year} | {edu.marks}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-[11px] font-bold uppercase border-b pb-0.5 mb-1" style={{ color: themeColor }}>Skills</h3>
        <p className="text-[10px] text-slate-700">{data.skills}</p>
      </div>
    </div>
    <div className="border-t pt-2 text-[8px] text-slate-400 text-center">PrimeAstra Classic Template</div>
  </div>
);