import React, { useState } from 'react';
import {
  Search,
  Filter,
  Heart,
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
  ArrowUpDown,
} from 'lucide-react';
import { AppTheme, ToolCategory, ToolItem } from '../types';

interface AllToolsViewProps {
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  theme: AppTheme;
}

export const AllToolsView: React.FC<AllToolsViewProps> = ({
  tools,
  onSelectTool,
  favoriteIds,
  onToggleFavorite,
  theme,
}) => {
  const isDark = theme === 'luminous-dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');

  const categories: string[] = [
    'All',
    'Conversion',
    'Image',
    'Utility',
    'AI / Career',
    'Design',
    'Developer',
    'Security',
  ];

  const filteredTools = tools
    .filter((tool) => {
      const matchesCat =
        selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesQuery =
        !filterQuery ||
        tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
        tool.keywords?.some((k) => k.toLowerCase().includes(filterQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });

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
      case 'code':
        return <Code className="w-5 h-5 text-indigo-500" />;
      case 'palette':
        return <Palette className="w-5 h-5 text-fuchsia-500" />;
      default:
        return <Wrench className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-2xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            All Tools Catalog
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Explore our complete suite of 120+ offline-capable WebAssembly utilities.
          </p>
        </div>

        {/* Local Search and Sort */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter catalog..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none transition ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white focus:ring-1 focus:ring-cyan-500'
                  : 'bg-white border-slate-200 text-slate-800 focus:ring-1 focus:ring-violet-500'
              }`}
            />
          </div>

          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'popular' ? 'name' : 'popular')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="capitalize">{sortBy}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? isDark
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                    : 'bg-violet-600 text-white shadow-clay-sm'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => {
          const isFav = favoriteIds.includes(tool.id);

          return (
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

                  <div className="flex items-center gap-1.5">
                    {tool.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                          isDark
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => onToggleFavorite(tool.id, e)}
                      className="p-1 rounded text-slate-300 hover:text-rose-500 transition"
                      title={isFav ? 'Remove Favorite' : 'Add to Favorite'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  </div>
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
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-slate-500">
            No tools match the selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setFilterQuery('');
            }}
            className="mt-2 text-xs font-bold text-violet-600 dark:text-cyan-400 underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
