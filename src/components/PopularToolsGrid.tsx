import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Pipette,
  Maximize2,
  ShieldCheck,
  MoreHorizontal,
  ChevronRight,
  Heart,
  Share2,
} from 'lucide-react';
import { AppTheme, ToolItem } from '../types';

interface PopularToolsGridProps {
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onViewAll: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  theme: AppTheme;
}

export const PopularToolsGrid: React.FC<PopularToolsGridProps> = ({
  tools,
  onSelectTool,
  onViewAll,
  favoriteIds,
  onToggleFavorite,
  theme,
}) => {
  const isDark = theme === 'luminous-dark';
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Render the distinctive icon for each tool
  const renderIcon = (tool: ToolItem) => {
    switch (tool.id) {
      case 'pdf-converter':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark ? 'bg-red-950/60 text-red-400 border border-red-800/40' : 'bg-red-50 text-red-500'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'image-compressor':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                : 'bg-emerald-50 text-emerald-500'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
          </div>
        );
      case 'qr-generator':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            <QrCode className="w-5 h-5" />
          </div>
        );
      case 'ai-resume':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                : 'bg-purple-50 text-purple-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
        );
      case 'color-picker':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                : 'bg-blue-50 text-blue-500'
            }`}
          >
            <Pipette className="w-5 h-5" />
          </div>
        );
      case 'json-formatter':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 font-mono font-bold text-sm ${
              isDark
                ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                : 'bg-amber-50 text-amber-500'
            }`}
          >
            {'{ }'}
          </div>
        );
      case 'image-resizer':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-pink-950/60 text-pink-400 border border-pink-800/40'
                : 'bg-pink-50 text-pink-500'
            }`}
          >
            <Maximize2 className="w-5 h-5" />
          </div>
        );
      case 'password-generator':
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-teal-950/60 text-teal-400 border border-teal-800/40'
                : 'bg-teal-50 text-teal-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark ? 'bg-slate-800 text-cyan-400' : 'bg-violet-50 text-violet-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  const getHoverAccent = (toolId: string) => {
    switch (toolId) {
      case 'pdf-converter':
        return isDark ? 'group-hover:text-red-400' : 'group-hover:text-red-600';
      case 'image-compressor':
        return isDark ? 'group-hover:text-emerald-400' : 'group-hover:text-emerald-600';
      case 'qr-generator':
        return isDark ? 'group-hover:text-slate-300' : 'group-hover:text-slate-800';
      case 'ai-resume':
        return isDark ? 'group-hover:text-purple-300' : 'group-hover:text-purple-600';
      case 'color-picker':
        return isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600';
      case 'json-formatter':
        return isDark ? 'group-hover:text-amber-400' : 'group-hover:text-amber-600';
      case 'image-resizer':
        return isDark ? 'group-hover:text-pink-400' : 'group-hover:text-pink-600';
      case 'password-generator':
        return isDark ? 'group-hover:text-teal-400' : 'group-hover:text-teal-600';
      default:
        return 'group-hover:text-violet-600';
    }
  };

  return (
    <section className="space-y-4" data-purpose="tools-grid-section">
      <div className="flex items-center justify-between px-1">
        <h3
          className={`text-sm font-bold tracking-wide uppercase ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          Popular Tools
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className={`text-xs font-semibold flex items-center gap-1 group transition ${
            isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-500 hover:text-violet-600'
          }`}
        >
          <span>View all tools</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 8-Card Grid Layout Matching Clean Specification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" id="toolsGrid">
        {tools.map((tool) => {
          const isFav = favoriteIds.includes(tool.id);
          const isMenuOpen = activeMenuId === tool.id;

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className={`tool-card group rounded-2xl p-4.5 border flex flex-col justify-between cursor-pointer relative ${
                isDark
                  ? 'dark-ios-glass-card'
                  : 'ios-glass-card'
              }`}
              data-tool={tool.id}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  {renderIcon(tool)}

                  <div className="flex items-center gap-1 relative">
                    {tool.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                          isDark
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-700/50'
                            : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : tool.id);
                      }}
                      className={`p-1 rounded transition ${
                        isDark
                          ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                          : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Context menu dropdown */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute right-0 top-7 w-40 rounded-xl shadow-floating border p-1 z-30 animate-in fade-in zoom-in-95 duration-100 ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            onToggleFavorite(tool.id, e);
                            setActiveMenuId(null);
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                            isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                            }`}
                          />
                          <span>{isFav ? 'Remove Favorite' : 'Add to Favorites'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setActiveMenuId(null);
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                            isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Tool Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4
                    className={`text-xs font-bold transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    } ${getHoverAccent(tool.id)}`}
                  >
                    {tool.name}
                  </h4>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {tool.description}
                  </p>
                </div>
              </div>

              <div
                className={`pt-3 mt-2 border-t flex items-center justify-between text-[10px] ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded-md font-medium ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tool.category}
                </span>
                <span
                  className={`font-semibold opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? 'text-cyan-400' : 'text-violet-600'
                  }`}
                >
                  Launch →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
