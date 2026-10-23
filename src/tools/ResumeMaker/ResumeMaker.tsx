import React, { useState } from 'react';
import { Sparkles, Download, RotateCcw, Plus, Trash2, ArrowLeft, Layers } from 'lucide-react';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';

export interface ResumeData {
  name: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  summary: string;
  education: Array<{ degree: string; board: string; year: string; marks: string }>;
  experience: Array<{ role: string; company: string; period: string; desc: string }>;
  skills: string;
  languages: string;
}

export const ResumeMaker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [template, setTemplate] = useState<'modern' | 'classic' | 'executive'>('modern');
  const [themeColor, setThemeColor] = useState('#1e3a8a');

  const [formData, setFormData] = useState<ResumeData>({
    name: 'Shubham Singh',
    title: 'Computer Operator & Executive',
    phone: '+91 9876543210',
    email: 'shubham@example.com',
    address: 'Roorkee, Uttarakhand',
    summary: 'Dedicated professional with hands-on experience in computer operations and digital documentation.',
    education: [{ degree: '12th (Commerce)', board: 'DAV Inter College', year: '2016', marks: 'First Division' }],
    experience: [{ role: 'Computer Operator', company: 'Digital Seva Center', period: '2021 - Present', desc: 'Managed online operations.' }],
    skills: 'MS Office, Data Entry, Computer Operations, Typing',
    languages: 'Hindi, English',
  });

  const addEducation = () => setFormData(p => ({ ...p, education: [...p.education, { degree: '', board: '', year: '', marks: '' }] }));
  const removeEducation = (i: number) => setFormData(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));
  const addExperience = () => setFormData(p => ({ ...p, experience: [...p.experience, { role: '', company: '', period: '', desc: '' }] }));
  const removeExperience = (i: number) => setFormData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      <div className="p-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition cursor-pointer" title="Back">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" /> AI Resume Maker
            </h2>
            <p className="text-[11px] text-purple-100">Live preview &amp; printable PDF ready</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF / Print</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600" /> Select Template:
              </span>
              <div className="flex items-center gap-1.5">
                {(['modern', 'classic', 'executive'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition capitalize ${
                      template === t ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Theme Color:</span>
                <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-7 h-7 rounded-lg border-0 cursor-pointer" />
              </div>
              <button type="button" onClick={() => window.location.reload()} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition cursor-pointer">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-800 border-b pb-1">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Job Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Mobile</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-500">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-500">Summary</label>
                <textarea rows={2} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold text-slate-800">Education</h3>
              <button onClick={addEducation} className="text-[11px] text-purple-700 font-bold flex items-center gap-1 cursor-pointer">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                {formData.education.length > 1 && (
                  <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div>
                  <label className="text-[10px] text-slate-500">Degree</label>
                  <input type="text" value={edu.degree} onChange={e => { const up = [...formData.education]; up[index].degree = e.target.value; setFormData({ ...formData, education: up }); }} className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Board</label>
                  <input type="text" value={edu.board} onChange={e => { const up = [...formData.education]; up[index].board = e.target.value; setFormData({ ...formData, education: up }); }} className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h3 className="text-xs font-bold text-slate-800 border-b pb-1">Skills &amp; Languages</h3>
            <div>
              <label className="text-[10px] font-semibold text-slate-500">Skills</label>
              <input type="text" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500">Languages</label>
              <input type="text" value={formData.languages} onChange={e => setFormData({ ...formData, languages: e.target.value })} className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-200/70 p-2 sm:p-3 rounded-2xl border border-slate-300 flex justify-center lg:sticky lg:top-0 w-full overflow-x-auto">
          {template === 'modern' && <ModernTemplate data={formData} themeColor={themeColor} />}
          {template === 'classic' && <ClassicTemplate data={formData} themeColor={themeColor} />}
          {template === 'executive' && <ExecutiveTemplate data={formData} themeColor={themeColor} />}
        </div>
      </div>
    </div>
  );
};