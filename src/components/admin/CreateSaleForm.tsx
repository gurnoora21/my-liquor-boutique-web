
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSales } from '@/hooks/useSales';
import { Sale, SaleTheme, THEME_COLORS } from '@/types/sales';

interface CreateSaleFormProps {
  onSuccess: () => void;
}

interface FormData {
  name: string;
  theme: SaleTheme;
  start_date: string;
  end_date: string;
  background_color: string;
  accent_color: string;
}

const CreateSaleForm: React.FC<CreateSaleFormProps> = ({ onSuccess }) => {
  const { createSale } = useSales();
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      theme: 'general',
      start_date: '',
      end_date: '',
      background_color: THEME_COLORS.general.background,
      accent_color: THEME_COLORS.general.accent,
    },
  });

  const selectedTheme = form.watch('theme');

  React.useEffect(() => {
    const colors = THEME_COLORS[selectedTheme];
    form.setValue('background_color', colors.background);
    form.setValue('accent_color', colors.accent);
  }, [selectedTheme, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await createSale({
        ...data,
        is_active: false,
      });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Failed to create sale:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Sale name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Halloween Special 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            rules={{ required: 'Theme is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="easter">Easter</SelectItem>
                    <SelectItem value="halloween">Halloween</SelectItem>
                    <SelectItem value="victoria-day">Victoria Day</SelectItem>
                    <SelectItem value="christmas">Christmas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            rules={{ required: 'Start date is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            rules={{ required: 'End date is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="background_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input type="color" {...field} className="w-16 h-10 p-1" />
                    <Input {...field} placeholder="#F59E0B" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accent_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input type="color" {...field} className="w-16 h-10 p-1" />
                    <Input {...field} placeholder="#1A1A1A" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Create Sale
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateSaleForm;
