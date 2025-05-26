
export type SaleTheme = 'easter' | 'halloween' | 'victoria-day' | 'christmas' | 'general';
export type ProductCategory = 'spirits' | 'wine' | 'beer' | 'coolers' | 'mixers' | 'accessories';

export interface Sale {
  id: string;
  name: string;
  theme: SaleTheme;
  start_date: string;
  end_date: string;
  is_active: boolean;
  header_image?: string;
  background_color: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
}

export interface SaleProduct {
  id: string;
  sale_id: string;
  product_name: string;
  product_image?: string;
  original_price: number;
  sale_price: number;
  size?: string;
  category: ProductCategory;
  badge_text?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface FlyerTemplate {
  id: string;
  name: string;
  theme: SaleTheme;
  layout_config: {
    columns: number;
    rows: number;
    header_height: number;
    footer_height: number;
  };
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const THEME_COLORS = {
  easter: { background: '#FF8C00', accent: '#8B4513' },
  halloween: { background: '#FF8C00', accent: '#000000' },
  'victoria-day': { background: '#DC2626', accent: '#FFFFFF' },
  christmas: { background: '#DC2626', accent: '#059669' },
  general: { background: '#F59E0B', accent: '#1A1A1A' }
};
