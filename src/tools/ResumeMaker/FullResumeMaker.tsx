import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  ArrowLeft,
  Layers,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Globe,
  User,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Palette,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  grade: string;
  location?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  technologies: string;
  link?: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface FullResumeData {
  name: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;

  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];

  skills: string; // comma separated
  softSkills: string;
  languages: string;
  interests: string;
  declaration: string;
}

const defaultSampleResume: FullResumeData = {
  name: 'Rahul Sharma',
  title: 'Senior Full Stack & Cloud Developer',
  phone: '+91 98765 43210',
  email: 'rahul.sharma@example.com',
  address: 'Sunder Nagri, New Delhi - 110093',
  linkedin: 'linkedin.com/in/rahulsharma',
  github: 'github.com/rahulsharma',
  website: 'rahulsharma.dev',
  summary:
    'Innovative and detail-oriented Software Engineer with 4+ years of professional experience in architecting scalable web applications, REST APIs, GST invoicing pipelines, and reactive user interfaces. Skilled in modern TypeScript, React, Node.js, and cloud deployments.',

  experiences: [
    {
      id: 'exp-1',
      role: 'Lead Frontend Developer',
      company: 'PrimeAstra Tech Pvt Ltd',
      duration: '2022 - Present',
      location: 'Noida, UP',
      description:
        '• Architected high-performance web applications handling 50k+ daily users.\n• Developed custom GST Tax Invoice Generator and client-side media pipelines.\n• Improved core web vitals and client-side page load speed by 42%.',
    },
    {
      id: 'exp-2',
      role: 'Full Stack Associate',
      company: 'Digital Solutions India',
      duration: '2020 - 2022',
      location: 'New Delhi, India',
      description:
        '• Designed responsive UI modules using React, Tailwind CSS, and Node.js.\n• Integrated third-party payment gateways and secure authentication flows.',
    },
  ],

  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'Delhi Technological University (DTU)',
      year: '2016 - 2020',
      grade: '8.7 CGPA / First Division',
      location: 'New Delhi',
    },
    {
      id: 'edu-2',
      degree: 'Senior Secondary Certificate (12th Science)',
      school: 'DAV Public School',
      year: '2016',
      grade: '91.4%',
      location: 'Delhi',
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'PrimeAstra Pro Workspace & Invoice Suite',
      technologies: 'React, TypeScript, Tailwind, Firebase, html2canvas',
      link: 'https://primeastra.com',
      description:
        'Complete web suite featuring GST invoicing with instant UPI QR codes, video clipper, and career tools.',
    },
    {
      id: 'proj-2',
      title: 'Real-time AI Video Frame Clipper',
      technologies: 'Web Audio API, MediaPipe, Canvas 2D, WebM',
      link: 'github.com/rahul/clipper',
      description:
        'Client-side video frame slicer with face stabilization and synchronized stereo audio recording.',
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      id: 'cert-2',
      name: 'Meta Certified Professional Frontend Developer',
      issuer: 'Coursera / Meta',
      year: '2022',
    },
  ],

  skills: 'React, TypeScript, JavaScript, Tailwind CSS, Node.js, Express, Firebase, PostgreSQL, Git, Next.js',
  softSkills: 'Team Leadership, Problem Solving, Agile Scrum, System Design, Communication',
  languages: 'English (Fluent), Hindi (Native)',
  interests: 'Open Source, Tech Blogging, 3D Graphics, Chess',
  declaration: 'I hereby declare that all the information given above is true and correct to the best of my knowledge.',
};

const blankResumeData: FullResumeData = {
  name: '',
  title: '',
  phone: '',
  email: '',
  address: '',
  linkedin: '',
  github: '',
  website: '',
  summary: '',
  experiences: [
    {
      id: 'exp-1',
      role: '',
      company: '',
      duration: '',
      location: '',
      description: '',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: '',
      school: '',
      year: '',
      grade: '',
    },
  ],
  projects: [],
  certifications: [],
  skills: '',
  softSkills: '',
  languages: '',
  interests: '',
  declaration: 'I hereby declare that all the information given above is true and correct.',
};

export const FullResumeMaker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [data, setData] = useState<FullResumeData>(defaultSampleResume);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'executive'>('modern');
  const [themeColor, setThemeColor] = useState<string>('#e2c072');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Add / Remove handlers
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          role: '',
          company: '',
          duration: '',
          location: '',
          description: '',
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((item) => item.id !== id),
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: '',
          school: '',
          year: '',
          grade: '',
        },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          title: '',
          technologies: '',
          description: '',
        },
      ],
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const addCertification = () => {
    setData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: `cert-${Date.now()}`,
          name: '',
          issuer: '',
          year: '',
        },
      ],
    }));
  };

  const removeCertification = (id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  };

  // High quality PDF download
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);

    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const safeName = (data.name || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeName}_Resume.pdf`);
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full space-y-4 text-left pt-1">
      {/* Top Banner */}
      <div className="p-3.5 bg-[#121216] text-white rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-xs border border-[rgba(226,192,114,0.2)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 bg-[#1c1c24] hover:bg-[#252530] text-[#e2c072] border border-[rgba(226,192,114,0.2)] rounded-xl transition cursor-pointer"
            title="Back to Tools"
          >
            <ArrowLeft className="w-4 h-4 text-[#e2c072]" />
          </button>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-white">
              <span>✨</span> Professional AI Resume Maker
            </h2>
            <p className="text-[11px] text-slate-400">
              Full fields • Experiences, Education, Projects, Certifications • Direct PDF Download
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setData(defaultSampleResume)}
            className="px-3 py-1.5 bg-[#1c1c24] hover:bg-[#252530] text-[#e2c072] border border-[rgba(226,192,114,0.3)] rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={() => setData(blankResumeData)}
            className="px-3 py-1.5 bg-[#1c1c24] hover:bg-[#252530] text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Clear Form
          </button>
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] rounded-xl text-xs font-extrabold shadow hover:brightness-110 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Scrollable Form / Right Sticky A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: SCROLLABLE FORM (CONTAINING ALL COMPREHENSIVE FIELDS) */}
        <div className="lg:col-span-7 space-y-4 max-h-[750px] overflow-y-auto pr-2 form-scroll text-xs">
          {/* Template & Color Selector */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#e2c072]" /> Select Template Style:
              </span>
              <div className="flex items-center gap-1.5">
                {(['modern', 'classic', 'executive'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
                      template === t
                        ? 'bg-[#e2c072] text-[#070707] shadow-sm'
                        : 'bg-[#181820] text-slate-300 hover:bg-[#252530]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(226,192,114,0.15)]">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#e2c072]" />
                <span className="font-semibold text-slate-300">Theme Accent:</span>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                />
              </div>
              <span className="text-[10px] text-slate-400">All fields auto-save to live preview</span>
            </div>
          </div>

          {/* 1. PERSONAL DETAILS */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[rgba(226,192,114,0.15)] pb-1.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#e2c072]" /> 1. Personal &amp; Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white font-bold text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Professional Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Phone / Mobile *</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Email Address *</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400">Complete Address / City, State, Pincode *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunder Nagri, New Delhi - 110093"
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">LinkedIn Profile URL</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/username"
                  value={data.linkedin}
                  onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Portfolio / GitHub / Website</label>
                <input
                  type="text"
                  placeholder="github.com/username or yoursite.com"
                  value={data.website}
                  onChange={(e) => setData({ ...data, website: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400">Professional Summary / Career Objective *</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of skills, background, achievements, and career goals..."
                  value={data.summary}
                  onChange={(e) => setData({ ...data, summary: e.target.value })}
                  className="w-full mt-1 p-2 border border-[rgba(226,192,114,0.2)] rounded-xl bg-[#181820] text-white text-xs focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 2. WORK EXPERIENCE (DYNAMIC LIST) */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(226,192,114,0.15)] pb-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-[#e2c072]" /> 2. Work Experience ({data.experiences.length})
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] hover:bg-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3 h-3" /> Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {data.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.2)] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#e2c072] text-[10.5px]">Position #{idx + 1}</span>
                    {data.experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                        title="Remove position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Job Role / Position *</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Frontend Developer"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].role = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Company Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. PrimeAstra Tech"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].company = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Duration *</label>
                      <input
                        type="text"
                        placeholder="e.g. 2022 - Present or Jan 2021 - Dec 2023"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].duration = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Noida, UP / Remote"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].location = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[9.5px] font-semibold text-slate-400">Responsibilities &amp; Key Achievements</label>
                      <textarea
                        rows={2}
                        placeholder="• Key deliverables achieved...&#10;• Technologies utilized and impacts delivered..."
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].description = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. EDUCATION (DYNAMIC LIST) */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(226,192,114,0.15)] pb-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#e2c072]" /> 3. Education ({data.education.length})
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] hover:bg-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3 h-3" /> Add Education
              </button>
            </div>

            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.2)] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#e2c072] text-[10.5px]">Education #{idx + 1}</span>
                    {data.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                        title="Remove education"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Degree / Diploma / Course *</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech in CSE / BCA / 12th"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].degree = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">School / College / University *</label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi University / DTU / DAV College"
                        value={edu.school}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].school = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Year / Duration *</label>
                      <input
                        type="text"
                        placeholder="e.g. 2018 - 2022"
                        value={edu.year}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].year = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Grade / CGPA / Percentage</label>
                      <input
                        type="text"
                        placeholder="e.g. 8.8 CGPA / 85% / First Division"
                        value={edu.grade}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].grade = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SKILLS & LANGUAGES */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[rgba(226,192,114,0.15)] pb-1.5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e2c072]" /> 4. Skills &amp; Languages
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Technical Skills (comma separated) *</label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Tailwind, Node.js, GST, Excel, SQL"
                  value={data.skills}
                  onChange={(e) => setData({ ...data, skills: e.target.value })}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Soft Skills &amp; Tools</label>
                <input
                  type="text"
                  placeholder="e.g. Problem Solving, Team Leadership, Photoshop, Figma"
                  value={data.softSkills}
                  onChange={(e) => setData({ ...data, softSkills: e.target.value })}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400">Languages Known *</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindi, English"
                    value={data.languages}
                    onChange={(e) => setData({ ...data, languages: e.target.value })}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400">Interests &amp; Hobbies</label>
                  <input
                    type="text"
                    placeholder="e.g. Chess, Tech Blogging, Design"
                    value={data.interests}
                    onChange={(e) => setData({ ...data, interests: e.target.value })}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. PROJECTS (DYNAMIC LIST) */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(226,192,114,0.15)] pb-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-3.5 h-3.5 text-[#e2c072]" /> 5. Key Projects ({data.projects.length})
              </h3>
              <button
                type="button"
                onClick={addProject}
                className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] hover:bg-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3 h-3" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.2)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#e2c072] text-[10.5px]">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Project Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. PrimeAstra Workspace"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].title = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-semibold text-slate-400">Tech Stack Used</label>
                      <input
                        type="text"
                        placeholder="e.g. React, TypeScript, Node"
                        value={proj.technologies}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].technologies = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[9.5px] font-semibold text-slate-400">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Brief overview and accomplishments of this project..."
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].description = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. CERTIFICATIONS */}
          <div className="bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] space-y-3">
            <div className="flex items-center justify-between border-b border-[rgba(226,192,114,0.15)] pb-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#e2c072]" /> 6. Certifications ({data.certifications.length})
              </h3>
              <button
                type="button"
                onClick={addCertification}
                className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] hover:bg-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3 h-3" /> Add Certificate
              </button>
            </div>

            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={cert.id} className="p-2.5 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.2)] flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Certificate Name"
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...data.certifications];
                        updated[idx].name = e.target.value;
                        setData({ ...data, certifications: updated });
                      }}
                      className="p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Org"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...data.certifications];
                        updated[idx].issuer = e.target.value;
                        setData({ ...data, certifications: updated });
                      }}
                      className="p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={cert.year}
                      onChange={(e) => {
                        const updated = [...data.certifications];
                        updated[idx].year = e.target.value;
                        setData({ ...data, certifications: updated });
                      }}
                      className="p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert.id)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE A4 PREVIEW (STICKY) */}
        <div className="lg:col-span-5 bg-[#121216] p-3 rounded-2xl border border-[rgba(226,192,114,0.2)] w-full overflow-hidden flex flex-col justify-start items-center lg:sticky lg:top-4 shadow-2xl">
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[rgba(226,192,114,0.15)] text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#e2c072]" /> A4 Live Preview ({template})
            </span>
            <span className="text-[10px] text-[#e2c072] font-semibold">Print &amp; ATS Ready</span>
          </div>

          <div
            ref={previewRef}
            id="resumeA4PrintArea"
            className="w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200 text-slate-900 text-xs min-h-[600px]"
            style={{ fontFamily: template === 'classic' ? 'serif' : 'sans-serif' }}
          >
            {/* MODERN TEMPLATE */}
            {template === 'modern' && (
              <div className="w-full flex min-h-[580px]">
                {/* Left Colored Sidebar */}
                <div
                  className="w-[36%] text-white p-4 flex flex-col justify-between shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">
                        Contact
                      </h4>
                      <div className="space-y-1.5 text-[9.5px] text-white/95">
                        <p className="break-all">📞 {data.phone}</p>
                        <p className="break-all">✉️ {data.email}</p>
                        <p className="break-words">📍 {data.address}</p>
                        {data.linkedin && <p className="break-all">🔗 {data.linkedin}</p>}
                        {data.website && <p className="break-all">🌐 {data.website}</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">
                        Core Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {data.skills.split(',').map((s, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-semibold"
                          >
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {data.languages && (
                      <div>
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-1.5">
                          Languages
                        </h4>
                        <p className="text-[9px] text-white/90">{data.languages}</p>
                      </div>
                    )}

                    {data.interests && (
                      <div>
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-1.5">
                          Interests
                        </h4>
                        <p className="text-[9px] text-white/90">{data.interests}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-[8px] text-white/60 pt-3 border-t border-white/10">
                    PrimeAstra Verified Resume
                  </div>
                </div>

                {/* Right Main Body */}
                <div className="w-[64%] p-5 flex flex-col justify-between space-y-4 min-w-0">
                  <div>
                    <div className="border-b border-slate-200 pb-2 mb-3">
                      <h1 className="text-xl font-black truncate" style={{ color: themeColor }}>
                        {data.name || 'Your Name'}
                      </h1>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide truncate">
                        {data.title || 'Your Profession'}
                      </p>
                      {data.summary && (
                        <p className="text-[9.5px] text-slate-600 mt-1.5 leading-relaxed">
                          {data.summary}
                        </p>
                      )}
                    </div>

                    {data.experiences.length > 0 && (
                      <div className="mb-3">
                        <h3
                          className="text-[10.5px] font-black uppercase mb-1.5 pb-0.5 border-b border-slate-200"
                          style={{ color: themeColor }}
                        >
                          Experience
                        </h3>
                        <div className="space-y-2">
                          {data.experiences.map((exp) => (
                            <div key={exp.id} className="text-[9.5px]">
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{exp.role}</span>
                                <span className="text-slate-400 font-normal">{exp.duration}</span>
                              </div>
                              <p className="text-slate-600 font-medium">
                                {exp.company} {exp.location && `• ${exp.location}`}
                              </p>
                              {exp.description && (
                                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed whitespace-pre-line">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.education.length > 0 && (
                      <div className="mb-3">
                        <h3
                          className="text-[10.5px] font-black uppercase mb-1.5 pb-0.5 border-b border-slate-200"
                          style={{ color: themeColor }}
                        >
                          Education
                        </h3>
                        <div className="space-y-1.5">
                          {data.education.map((edu) => (
                            <div key={edu.id} className="text-[9.5px] flex justify-between">
                              <div>
                                <p className="font-bold text-slate-900">{edu.degree}</p>
                                <p className="text-slate-600 font-medium">{edu.school}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-400">{edu.year}</span>
                                {edu.grade && <p className="text-slate-700 font-bold">{edu.grade}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.projects.length > 0 && (
                      <div className="mb-3">
                        <h3
                          className="text-[10.5px] font-black uppercase mb-1 pb-0.5 border-b border-slate-200"
                          style={{ color: themeColor }}
                        >
                          Projects
                        </h3>
                        <div className="space-y-1.5">
                          {data.projects.map((proj) => (
                            <div key={proj.id} className="text-[9px]">
                              <span className="font-bold text-slate-900">{proj.title}</span>
                              <span className="text-slate-400 ml-1">({proj.technologies})</span>
                              <p className="text-slate-600 mt-0.5 leading-snug">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.certifications.length > 0 && (
                      <div>
                        <h3
                          className="text-[10.5px] font-black uppercase mb-1 pb-0.5 border-b border-slate-200"
                          style={{ color: themeColor }}
                        >
                          Certifications
                        </h3>
                        <p className="text-[9px] text-slate-700">
                          {data.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`).join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CLASSIC TEMPLATE */}
            {template === 'classic' && (
              <div className="w-full p-6 text-slate-900 font-serif space-y-3.5">
                <div className="text-center border-b border-slate-300 pb-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">{data.name}</h1>
                  <p className="text-xs font-semibold text-slate-600 uppercase mt-0.5 tracking-wider">
                    {data.title}
                  </p>
                  <p className="text-[9.5px] text-slate-500 mt-1">
                    {data.phone} • {data.email} • {data.address} {data.linkedin && `• ${data.linkedin}`}
                  </p>
                </div>

                {data.summary && (
                  <div>
                    <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 pb-0.5 mb-1 text-slate-800">
                      Professional Summary
                    </h3>
                    <p className="text-[9.5px] text-slate-700 leading-relaxed">{data.summary}</p>
                  </div>
                )}

                {data.experiences.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 pb-0.5 mb-1.5 text-slate-800">
                      Work Experience
                    </h3>
                    <div className="space-y-2">
                      {data.experiences.map((exp) => (
                        <div key={exp.id} className="text-[9.5px]">
                          <div className="flex justify-between font-bold">
                            <span>
                              {exp.role} - <span className="font-normal text-slate-600">{exp.company}</span>
                            </span>
                            <span className="text-slate-500 font-normal">{exp.duration}</span>
                          </div>
                          {exp.description && (
                            <p className="text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.education.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 pb-0.5 mb-1 text-slate-800">
                      Education
                    </h3>
                    <div className="space-y-1">
                      {data.education.map((edu) => (
                        <div key={edu.id} className="text-[9.5px] flex justify-between">
                          <div>
                            <strong>{edu.degree}</strong> - {edu.school}
                          </div>
                          <span className="text-slate-600 font-semibold">{edu.year} | {edu.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 pb-0.5 mb-1 text-slate-800">
                    Key Skills &amp; Languages
                  </h3>
                  <p className="text-[9.5px] text-slate-700">
                    <strong>Skills:</strong> {data.skills} {data.softSkills && ` | ${data.softSkills}`}
                  </p>
                  {data.languages && (
                    <p className="text-[9.5px] text-slate-700 mt-0.5">
                      <strong>Languages:</strong> {data.languages}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* EXECUTIVE TEMPLATE */}
            {template === 'executive' && (
              <div className="w-full flex flex-col justify-between font-sans">
                <div>
                  <div className="p-5 text-white" style={{ backgroundColor: themeColor }}>
                    <h1 className="text-2xl font-black tracking-tight">{data.name}</h1>
                    <p className="text-xs font-semibold text-white/90 uppercase tracking-wide mt-0.5">
                      {data.title}
                    </p>
                    <p className="text-[9.5px] text-white/80 mt-1">
                      📞 {data.phone} | ✉️ {data.email} | 📍 {data.address}
                    </p>
                  </div>

                  <div className="p-5 space-y-3.5">
                    {data.summary && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Executive Profile
                        </h4>
                        <p className="text-[9.5px] text-slate-700 leading-relaxed">{data.summary}</p>
                      </div>
                    )}

                    {data.experiences.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Professional Experience
                        </h4>
                        <div className="space-y-2">
                          {data.experiences.map((exp) => (
                            <div key={exp.id} className="text-[9.5px]">
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>
                                  {exp.role} • {exp.company}
                                </span>
                                <span className="text-slate-400">{exp.duration}</span>
                              </div>
                              <p className="text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.education.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Academic Background
                        </h4>
                        {data.education.map((edu) => (
                          <div key={edu.id} className="text-[9.5px] flex justify-between">
                            <span className="font-bold text-slate-800">
                              {edu.degree} - {edu.school}
                            </span>
                            <span className="text-slate-500">{edu.year} ({edu.grade})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Competencies &amp; Expertise
                      </h4>
                      <p className="text-[9.5px] text-slate-700">{data.skills}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
