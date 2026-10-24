// src/tools/ResumeMaker.tsx
import React, { useRef } from 'react';
import { ResumeData, ExperienceItem, EducationItem } from '../types/resume';
import { useNotification } from '../../context/NitificationContext.tsx';
import { ArrowLeft, Plus, Trash2, Printer, CheckCircle } from 'lucide-react';

interface ResumeMakerProps {
  formData: ResumeData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeData>>;
  themeColor: string;
  setThemeColor: (color: string) => void;
  onBack: () => void;
}

export default function ResumeMaker({
  formData,
  setFormData,
  themeColor,
  setThemeColor,
  onBack,
}: ResumeMakerProps): React.JSX.Element {
  const { addNotification } = useNotification();
  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpChange = (id: number, field: keyof ExperienceItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: Date.now(),
      role: '',
      company: '',
      duration: '',
      details: '',
    };
    setFormData((prev) => ({ ...prev, experience: [...prev.experience, newItem] }));
  };

  const removeExperience = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const handleEduChange = (id: number, field: keyof EducationItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: Date.now(),
      degree: '',
      institution: '',
      year: '',
    };
    setFormData((prev) => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const removeEducation = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const handlePrint = () => {
    window.print();
    addNotification('Print/Save prompt opened successfully!', 'info');
  };

  const handleSaveData = () => {
    addNotification('Resume data saved successfully!', 'info');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">AI Resume Maker</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveData}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Save
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Main Grid: Form (Left) & Preview (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* LEFT FORM: Scrollable */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto max-h-[calc(100vh-140px)] space-y-5">
          {/* Personal Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="Job Role / Headline"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="Location (City, State)"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Professional Summary
            </h3>
            <textarea
              rows={3}
              placeholder="Write a brief professional summary..."
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-600"
            />
          </div>

          {/* Job Experience */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Job
              </button>
            </div>

            {formData.experience.map((exp) => (
              <div
                key={exp.id}
                className="p-3 border border-slate-200 rounded-xl space-y-2.5 relative bg-slate-50/50"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Job Role"
                    value={exp.role}
                    onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 2022 - Present)"
                    value={exp.duration}
                    onChange={(e) => handleExpChange(exp.id, 'duration', e.target.value)}
                    className="col-span-2 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-blue-600"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Responsibilities & achievements..."
                  value={exp.details}
                  onChange={(e) => handleExpChange(exp.id, 'details', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none focus:border-blue-600"
                />
                {formData.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                4. Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            {formData.education.map((edu) => (
              <div
                key={edu.id}
                className="p-3 border border-slate-200 rounded-xl space-y-2 relative bg-slate-50/50"
              >
                <input
                  type="text"
                  placeholder="Degree / Course"
                  value={edu.degree}
                  onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-blue-600"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="College / Institute"
                    value={edu.institution}
                    onChange={(e) => handleEduChange(edu.id, 'institution', e.target.value)}
                    className="col-span-2 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEduChange(edu.id, 'year', e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-blue-600"
                  />
                </div>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Skills & Languages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              5. Skills & Languages
            </h3>
            <input
              type="text"
              placeholder="Skills (e.g. React, Node.js, MS Office)"
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
            <input
              type="text"
              placeholder="Languages (e.g. Hindi, English)"
              value={formData.languages}
              onChange={(e) => handleInputChange('languages', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* RIGHT PREVIEW: Fully Scaled Container, No Screen Cuts */}
        <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-start overflow-y-auto max-h-[calc(100vh-140px)]">
          <div
            ref={printRef}
            className="w-full max-w-[500px] bg-white shadow-md rounded-lg p-6 space-y-4 text-slate-800 text-xs leading-relaxed border border-slate-200 select-none"
            style={{ minHeight: '680px' }}
          >
            {/* Header Banner */}
            <div className="border-b-2 pb-3" style={{ borderColor: themeColor }}>
              <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: themeColor }}>
                {formData.fullName || 'YOUR NAME'}
              </h1>
              <p className="font-semibold text-slate-600 text-xs mt-0.5">
                {formData.jobTitle || 'TARGET PROFESSION'}
              </p>
              <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-2">
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <span>• {formData.phone}</span>}
                {formData.location && <span>• {formData.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {formData.summary && (
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] mb-1" style={{ color: themeColor }}>
                  Summary
                </h4>
                <p className="text-slate-600 leading-normal">{formData.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {formData.experience.length > 0 && (
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] mb-1.5" style={{ color: themeColor }}>
                  Experience
                </h4>
                <div className="space-y-2">
                  {formData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>{exp.role || 'Job Role'}</span>
                        <span className="text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <div className="text-slate-600 font-medium text-[11px]">{exp.company}</div>
                      {exp.details && <p className="text-slate-500 mt-0.5 text-[10.5px]">{exp.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {formData.education.length > 0 && (
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] mb-1.5" style={{ color: themeColor }}>
                  Education
                </h4>
                <div className="space-y-1.5">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between text-[11px]">
                      <div>
                        <div className="font-bold text-slate-800">{edu.degree || 'Degree / Diploma'}</div>
                        <div className="text-slate-500">{edu.institution}</div>
                      </div>
                      <span className="text-slate-500 text-[10px]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Languages */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              {formData.skills && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] mb-0.5" style={{ color: themeColor }}>
                    Skills
                  </h4>
                  <p className="text-slate-600 text-[10.5px]">{formData.skills}</p>
                </div>
              )}
              {formData.languages && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] mb-0.5" style={{ color: themeColor }}>
                    Languages
                  </h4>
                  <p className="text-slate-600 text-[10.5px]">{formData.languages}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}