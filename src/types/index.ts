export type ToolCategory =
  | 'Conversion'
  | 'Image'
  | 'Utility'
  | 'AI / Career'
  | 'Design'
  | 'Developer'
  | 'Security';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  isPopular?: boolean;
  isNew?: boolean;
  iconType:
    | 'pdf'
    | 'image'
    | 'qr'
    | 'ai'
    | 'color'
    | 'json'
    | 'resize'
    | 'shield'
    | 'code'
    | 'convert'
    | 'palette'
    | 'wrench';
  tagColor?: string;
  actionLabel?: string;
  badge?: string;
  keywords?: string[];
}

export type ActiveNav = 'home' | 'all-tools' | 'categories' | 'favorites' | 'settings';

export type AppTheme = 'clay-light' | 'luminous-dark';
