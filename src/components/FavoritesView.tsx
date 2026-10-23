import React from 'react';
import { Heart, ArrowRight, Sparkles, FileText, Image as ImageIcon, QrCode, Pipette, Maximize2, ShieldCheck, Code } from 'lucide-react';
import { AppTheme, ToolItem } from '../types';

interface FavoritesViewProps {
  tools: ToolItem[];
  favoriteIds: string[];
  onSelectTool: (tool: ToolItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onExplore: () => void;
  theme: AppTheme;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  tools,
  favoriteIds,
  onSelectTool,
  onToggleFavorite,
  onExplore,
  theme,
}) => {
  const isDark = theme === 'luminous-dark';
  const favoriteTools = tools.filter((t) => favoriteIds.includes(t.id));

  const renderIcon = (tool: ToolItem) => {
    switch (tool.iconType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'qr':
        return <QrCode className="w-5 h-5 text-slate-700 dark:text-cyan-400" />;
      case 'ai':
        return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'color':
        return <Pipette className="w-5 h-5 text-blue-500" />;
      case 'json':
        return <span className="font-mono font-bold text-amber-500 text-sm">{'{ }'}</span>;
      case 'resize':
        return <Maximize2 className="w-5 h-5 text-pink-500" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Code className="w-5 h-5 text-violet-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-2xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            My Favorites
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Quick-access bookmark list for your frequently used tools.
          </p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-rose-50 text-rose-600 border border-rose-200'
          }`}
        >
          {favoriteTools.length} Saved
        </span>
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {favoriteTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className={`group rounded-2xl p-4 border flex flex-col justify-between cursor-pointer relative ${
                isDark
                  ? 'dark-ios-glass-card'
                  : 'ios-glass-card'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-slate-800' : 'bg-slate-50'
                    }`}
                  >
                    {renderIcon(tool)}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onToggleFavorite(tool.id, e)}
                    className="p-1 rounded text-rose-500 hover:text-slate-400 transition"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>

                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    } group-hover:text-violet-600 dark:group-hover:text-cyan-400 transition-colors`}
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
          ))}
        </div>
      ) : (
        <div
          className={`text-center py-16 px-4 rounded-3xl border border-dashed ${
            isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3
            className={`text-sm font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            No favorites bookmarked yet
          </h3>
          <p
            className={`text-xs max-w-sm mx-auto mt-1 mb-4 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Click the heart icon on any tool card in the catalog to pin it here for one-click access.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white shadow-clay-sm hover:bg-violet-700 transition"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
