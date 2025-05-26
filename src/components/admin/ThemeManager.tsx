import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useThemes } from '@/hooks/useThemes';
import { Theme } from '@/types/sales';
import { Edit, Upload, Trash2, Plus } from 'lucide-react';

const ThemeManager = () => {
  const { themes, loading, createTheme, updateTheme, uploadHeaderImage } = useThemes();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [newTheme, setNewTheme] = useState({
    name: '',
    background_color: '#F59E0B',
    accent_color: '#1A1A1A'
  });

  const handleCreateTheme = async () => {
    try {
      await createTheme(newTheme);
      setNewTheme({ name: '', background_color: '#F59E0B', accent_color: '#1A1A1A' });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Theme created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create theme",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTheme = async (theme: Theme) => {
    try {
      await updateTheme(theme.id, theme);
      setEditingTheme(null);
      toast({
        title: "Success",
        description: "Theme updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (themeId: string, themeName: string, file: File) => {
    try {
      const imageUrl = await uploadHeaderImage(file, themeName);
      await updateTheme(themeId, { header_image_url: imageUrl });
      toast({
        title: "Success",
        description: "Header image uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading themes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Theme Management</h3>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          Create Theme
        </Button>
      </div>

      {/* Create New Theme Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Theme Name</Label>
              <Input
                id="name"
                value={newTheme.name}
                onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                placeholder="e.g., Summer Sale"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="background_color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newTheme.background_color}
                    onChange={(e) => setNewTheme({ ...newTheme, background_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={newTheme.background_color}
                    onChange={(e) => setNewTheme({ ...newTheme, background_color: e.target.value })}
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accent_color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newTheme.accent_color}
                    onChange={(e) => setNewTheme({ ...newTheme, accent_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={newTheme.accent_color}
                    onChange={(e) => setNewTheme({ ...newTheme, accent_color: e.target.value })}
                    placeholder="#1A1A1A"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTheme} disabled={!newTheme.name}>
                Create Theme
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Themes */}
      <div className="grid gap-4">
        {themes.map((theme) => (
          <Card key={theme.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: theme.background_color }}
                      title="Background Color"
                    />
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: theme.accent_color }}
                      title="Accent Color"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{theme.name}</h4>
                    <p className="text-sm text-gray-500">
                      {theme.background_color} • {theme.accent_color}
                    </p>
                  </div>
                  {theme.header_image_url && (
                    <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={theme.header_image_url}
                        alt={`${theme.name} header`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTheme(theme)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handleImageUpload(theme.id, theme.name, file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Theme Modal/Form */}
      {editingTheme && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Edit Theme: {editingTheme.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit_name">Theme Name</Label>
              <Input
                id="edit_name"
                value={editingTheme.name}
                onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_background">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editingTheme.background_color}
                    onChange={(e) => setEditingTheme({ ...editingTheme, background_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={editingTheme.background_color}
                    onChange={(e) => setEditingTheme({ ...editingTheme, background_color: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit_accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editingTheme.accent_color}
                    onChange={(e) => setEditingTheme({ ...editingTheme, accent_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={editingTheme.accent_color}
                    onChange={(e) => setEditingTheme({ ...editingTheme, accent_color: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleUpdateTheme(editingTheme)}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingTheme(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThemeManager;
