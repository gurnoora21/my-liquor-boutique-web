
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme } from '@/types/sales';

export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setThemes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const getThemeById = async (themeId: string) => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching theme:', err);
      return null;
    }
  };

  const createTheme = async (themeData: Omit<Theme, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .insert([themeData])
        .select()
        .single();

      if (error) throw error;
      await fetchThemes();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create theme');
      throw err;
    }
  };

  const updateTheme = async (id: string, updates: Partial<Theme>) => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchThemes();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update theme');
      throw err;
    }
  };

  const uploadHeaderImage = async (file: File, themeName: string) => {
    try {
      const fileName = `${themeName}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('theme-headers')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('theme-headers')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      throw err;
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return {
    themes,
    loading,
    error,
    fetchThemes,
    getThemeById,
    createTheme,
    updateTheme,
    uploadHeaderImage
  };
};
