import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Pipette,
  Maximize2,
  ShieldCheck,
  Code,
  Wrench,
  Palette,
  ChevronRight,
} from 'lucide-react';
import { AppTheme, ToolCategory, ToolItem } from '../types';

interface CategoriesViewProps {
  tools: ToolItem[];
  onSelectCategory: (category: ToolCategory) => void;
  onSelectTool: (tool: ToolItem) => void;
  theme: AppTheme;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  tools,
  onSelectCategory,
  onSelectTool,
  theme,
}) => {
  const isDark = theme === 'luminous-dark';

  const categoryCards: {
    category: ToolCategory;
    title: string;
    description: string;
    icon: any;
    colorClasses: string;
  }[] = [
    {
      category: 'Conversion',
      title: 'Document & Format Conversion',
      description: 'Convert between PDF, Word, Excel, CSV, JSON, Markdown, and WebP losslessly.',
      icon: FileText,
      colorClasses: 'bg-red-50 text-red-500 border-red-200',
    },
    {
      category: 'Image',
      title: 'Image & Media Processing',
      description: 'Compress, resize, remove EXIF privacy data, optimize SVGs, and generate favicons.',
      icon: ImageIcon,
      colorClasses: 'bg-emerald-50 text-emerald-500 border-emerald-200',
    },
    {
      category: 'Developer',
      title: 'Developer & Engineering Tools',
      description: 'JSON formatters, regex testers, JWT inspectors, UUID generators, and SQL beautifiers.',
      icon: Code,
      colorClasses: 'bg-amber-50 text-amber-500 border-amber-200',
    },
    {
      category: 'Security',
      title: 'Security, Crypto & Privacy',
      description: 'Ultra-strong password generators, SHA checksums, Diceware passphrases, and obfuscation.',
      icon: ShieldCheck,
      colorClasses: 'bg-teal-50 text-teal-600 border-teal-200',
    },
    {
      category: 'Design',
      title: 'Design & Visual Assets',
      description: 'Color pickers, harmonic shade palettes, WCAG contrast checkers, and glass CSS generators.',
      icon: Palette,
      colorClasses: 'bg-blue-50 text-blue-500 border-blue-200',
    },
    {
      category: 'AI / Career',
      title: 'AI & Career Acceleration',
      description: 'ATS resume analyzers, bullet point enhancers, job targeting, and markdown synthesizers.',
      icon: Sparkles,
      colorClasses: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      category: 'Utility',
      title: 'Utility & Everyday Productivity',
      description: 'Custom QR generators, word counters, casing converters, unit calculators, and dummy text.',
      icon: Wrench,
      colorClasses: 'bg-slate-100 text-slate-800 border-slate-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2
          className={`text-2xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Tool Categories
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Browse tools organized by workflow and technical domain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryCards.map((cat) => {
          const Icon = cat.icon;
          const matchingTools = tools.filter((t) => t.category === cat.category);

          return (
            <div
              key={cat.category}
              className={`rounded-3xl p-5 border flex flex-col justify-between ${
                isDark
                  ? 'dark-ios-glass-card'
                  : 'ios-glass-card'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${
                      isDark ? 'bg-slate-800 text-cyan-400' : cat.colorClasses
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isDark
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {matchingTools.length} tools
                  </span>
                </div>

                <div>
                  <h3
                    className={`text-sm font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {cat.description}
                  </p>
                </div>

                {/* Top tool pills inside category */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {matchingTools.slice(0, 3).map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => onSelectTool(tool)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200/60'
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`pt-4 mt-4 border-t flex items-center justify-between ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.category)}
                  className={`text-xs font-bold flex items-center gap-1 group transition ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-violet-600 hover:text-violet-700'
                  }`}
                >
                  <span>Explore category</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
