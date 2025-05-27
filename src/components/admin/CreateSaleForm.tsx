
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSales } from '@/hooks/useSales';
import { useThemes } from '@/hooks/useThemes';
import { SaleTheme } from '@/types/sales';

interface CreateSaleFormProps {
  onSuccess: () => void;
}

const CreateSaleForm: React.FC<CreateSaleFormProps> = ({ onSuccess }) => {
  const { createSale } = useSales();
  const { themes } = useThemes();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    theme: 'general' as SaleTheme,
    theme_id: '',
    start_date: '',
    end_date: '',
    background_color: '#F59E0B',
    accent_color: '#1A1A1A'
  });

  // Helper function to map theme names to enum values
  const mapThemeNameToEnum = (themeName: string): SaleTheme => {
    const themeMap: Record<string, SaleTheme> = {
      'General': 'general',
      'Easter': 'easter',
      'Halloween': 'halloween',
      'Victoria Day': 'victoria-day',
      'Christmas': 'christmas'
    };
    return themeMap[themeName] || 'general';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!formData.theme_id) {
      toast({
        title: "Error",
        description: "Please select a theme",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Creating sale with data:', {
        name: formData.name,
        theme: formData.theme,
        theme_id: formData.theme_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        background_color: formData.background_color,
        accent_color: formData.accent_color,
        is_active: false
      });

      await createSale({
        name: formData.name,
        theme: formData.theme,
        theme_id: formData.theme_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        background_color: formData.background_color,
        accent_color: formData.accent_color,
        is_active: false
      });

      toast({
        title: "Success",
        description: "Sale created successfully"
      });

      setFormData({
        name: '',
        theme: 'general',
        theme_id: '',
        start_date: '',
        end_date: '',
        background_color: '#F59E0B',
        accent_color: '#1A1A1A'
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating sale:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sale",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (themeId: string) => {
    const selectedTheme = themes.find(t => t.id === themeId);
    if (selectedTheme) {
      // Map the theme name to the enum value
      const themeEnum = mapThemeNameToEnum(selectedTheme.name);
      
      console.log('Theme selected:', {
        themeId,
        themeName: selectedTheme.name,
        themeEnum,
        backgroundColor: selectedTheme.background_color,
        accentColor: selectedTheme.accent_color
      });

      setFormData({
        ...formData,
        theme: themeEnum,
        theme_id: themeId,
        background_color: selectedTheme.background_color,
        accent_color: selectedTheme.accent_color
      });
    }
  };

  // Set default theme when themes are loaded
  React.useEffect(() => {
    if (themes.length > 0 && !formData.theme_id) {
      const generalTheme = themes.find(t => t.name.toLowerCase() === 'general') || themes[0];
      if (generalTheme) {
        handleThemeChange(generalTheme.id);
      }
    }
  }, [themes, formData.theme_id]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Sale Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter sale name"
          required
        />
      </div>

      <div>
        <Label htmlFor="theme">Theme *</Label>
        <Select value={formData.theme_id} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.background_color }}
                  />
                  {theme.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="background_color">Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.background_color}
              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
              className="w-16 h-10"
            />
            <Input
              value={formData.background_color}
              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
              placeholder="#F59E0B"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="accent_color">Accent Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.accent_color}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              className="w-16 h-10"
            />
            <Input
              value={formData.accent_color}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              placeholder="#1A1A1A"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Sale'}
      </Button>
    </form>
  );
};

export default CreateSaleForm;
