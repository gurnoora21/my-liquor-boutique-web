
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useSaleProducts } from '@/hooks/useSales';
import { supabase } from '@/integrations/supabase/client';
import { SaleProduct, ProductCategory } from '@/types/sales';

interface ProductFormProps {
  saleId: string;
  product?: SaleProduct | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  product_name: string;
  category: ProductCategory;
  original_price: number;
  sale_price: number;
  size?: string;
  badge_text?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ saleId, product, onSuccess, onCancel }) => {
  const { addProduct, updateProduct } = useSaleProducts(saleId);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.product_image || '');
  
  const form = useForm<FormData>({
    defaultValues: {
      product_name: product?.product_name || '',
      category: product?.category || 'spirits',
      original_price: product?.original_price || 0,
      sale_price: product?.sale_price || 0,
      size: product?.size || '',
      badge_text: product?.badge_text || '',
    },
  });

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${saleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const productData = {
        ...data,
        sale_id: saleId,
        product_image: imageUrl,
        position: product?.position || 0,
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const savings = form.watch('original_price') - form.watch('sale_price');
  const savingsPercent = form.watch('original_price') > 0 
    ? ((savings / form.watch('original_price')) * 100).toFixed(1)
    : 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="product_name"
            rules={{ required: 'Product name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Crown Royal 750ml" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="spirits">Spirits</SelectItem>
                    <SelectItem value="wine">Wine</SelectItem>
                    <SelectItem value="beer">Beer</SelectItem>
                    <SelectItem value="coolers">Coolers</SelectItem>
                    <SelectItem value="mixers">Mixers</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="original_price"
            rules={{ required: 'Original price is required', min: 0 }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="39.99"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_price"
            rules={{ required: 'Sale price is required', min: 0 }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="32.99"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="750ml, 24-pack, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badge_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge Text (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Big Size, Limited Time, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {savings > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">
              Savings: ${savings.toFixed(2)} ({savingsPercent}% off)
            </p>
          </div>
        )}

        <div className="space-y-4">
          <FormLabel>Product Image</FormLabel>
          <div className="flex items-center gap-4">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Product preview" 
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
