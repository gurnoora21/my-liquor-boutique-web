import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Crop as CropIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSaleProducts } from '@/hooks/useSales';
import { usePriceValidation } from '@/hooks/usePriceValidation';
import { supabase } from '@/integrations/supabase/client';
import { SaleProduct, ProductCategory } from '@/types/sales';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  
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

  const watchedOriginalPrice = form.watch('original_price');
  const watchedSalePrice = form.watch('sale_price');
  const watchedCategory = form.watch('category');

  // Enhanced real-time price validation with category awareness
  const priceValidation = usePriceValidation(watchedOriginalPrice, watchedSalePrice, watchedCategory);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        resolve(blob);
      }, 'image/png', 1);
    });
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      
      const fileExt = 'png';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${saleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, croppedBlob, { contentType: 'image/png' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      setShowCropModal(false);
      setSelectedFile(null);
      setImageSrc('');
    } catch (error) {
      console.error('Error uploading cropped image:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Use validation hook for consistency
    if (!priceValidation.isValid) {
      form.setError('sale_price', {
        type: 'manual',
        message: priceValidation.error || 'Invalid pricing'
      });
      return;
    }

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

  return (
    <>
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
              rules={{ required: 'Original price is required', min: { value: 0.01, message: 'Price must be greater than 0' } }}
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
              rules={{ 
                required: 'Sale price is required',
                min: { value: 0.01, message: 'Price must be greater than 0' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="32.99"
                      className={priceValidation.error ? 'border-red-500' : priceValidation.isValid && watchedSalePrice > 0 ? 'border-green-500' : ''}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                  {priceValidation.error && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      {priceValidation.error}
                    </div>
                  )}
                  {priceValidation.warning && priceValidation.isValid && (
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                      {priceValidation.warning}
                    </div>
                  )}
                  {priceValidation.suggestion && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      💡 {priceValidation.suggestion}
                    </div>
                  )}
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

          {priceValidation.isValid && watchedSalePrice > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">
                  💰 Savings: ${priceValidation.savings} ({priceValidation.savingsPercent}% off)
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <FormLabel>Product Image</FormLabel>
            <div className="flex items-center gap-4">
              {imageUrl && (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt="Product preview" 
                    className="w-24 h-24 object-cover rounded border shadow-sm"
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Processing image...</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Select an image to crop and upload for this product
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!priceValidation.isValid || uploading}>
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Image Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CropIcon className="w-5 h-5" />
              Crop Product Image
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageSrc && (
              <div className="max-h-96 overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    style={{ maxHeight: '400px', width: 'auto' }}
                    onLoad={(e) => {
                      const { width, height } = e.currentTarget;
                      setCrop({
                        unit: '%',
                        width: 80,
                        height: 80,
                        x: 10,
                        y: 10
                      });
                    }}
                  />
                </ReactCrop>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCropModal(false);
                  setSelectedFile(null);
                  setImageSrc('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropConfirm}
                disabled={!completedCrop || uploading}
              >
                {uploading ? 'Uploading...' : 'Crop & Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductForm;
