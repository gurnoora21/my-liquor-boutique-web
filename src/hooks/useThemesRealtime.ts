
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme } from '@/types/sales';

export const useThemesRealtime = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThemes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const getThemeById = async (id: string): Promise<Theme | null> => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('id', id)
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
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update theme');
      throw err;
    }
  };

  const deleteTheme = async (id: string) => {
    try {
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete theme');
      throw err;
    }
  };

  useEffect(() => {
    fetchThemes();

    // Set up real-time subscription for themes
    const themesChannel = supabase
      .channel('themes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'themes'
        },
        (payload) => {
          console.log('Theme change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setThemes(prev => [payload.new as Theme, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setThemes(prev => prev.map(theme => 
              theme.id === payload.new.id ? payload.new as Theme : theme
            ));
          } else if (payload.eventType === 'DELETE') {
            setThemes(prev => prev.filter(theme => theme.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(themesChannel);
    };
  }, []);

  return {
    themes,
    loading,
    error,
    fetchThemes,
    getThemeById,
    createTheme,
    updateTheme,
    deleteTheme
  };
};
