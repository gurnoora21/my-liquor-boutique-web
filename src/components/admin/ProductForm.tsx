import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Crop as CropIcon, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useOptimisticSaleProducts } from '@/hooks/useOptimisticSales';
import { usePriceValidation } from '@/hooks/usePriceValidation';
import { supabase } from '@/integrations/supabase/client';
import { SaleProduct, ProductCategory } from '@/types/sales';
import { useToast } from '@/hooks/use-toast';
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
  original_price: string;
  sale_price: string;
  size?: string;
  badge_text?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ saleId, product, onSuccess, onCancel }) => {
  const { addProduct, updateProduct } = useOptimisticSaleProducts(saleId);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
      original_price: product?.original_price ? product.original_price.toString() : '',
      sale_price: product?.sale_price ? product.sale_price.toString() : '',
      size: product?.size || '',
      badge_text: product?.badge_text || '',
    },
  });

  const watchedOriginalPrice = parseFloat(form.watch('original_price')) || 0;
  const watchedSalePrice = parseFloat(form.watch('sale_price')) || 0;
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
    if (!imgRef.current || !completedCrop) {
      toast({
        title: "Error",
        description: "Please select a crop area",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      
      const fileExt = 'png';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${saleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, croppedBlob, { contentType: 'image/png' });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      setShowCropModal(false);
      setSelectedFile(null);
      setImageSrc('');
      
      toast({
        title: "Success",
        description: "Image uploaded and cropped successfully",
      });
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data);
    setSubmitting(true);

    try {
      // Validate prices
      const originalPrice = parseFloat(data.original_price);
      const salePrice = parseFloat(data.sale_price);

      if (isNaN(originalPrice) || originalPrice <= 0) {
        form.setError('original_price', {
          type: 'manual',
          message: 'Please enter a valid original price'
        });
        toast({
          title: "Validation Error",
          description: "Please enter a valid original price",
          variant: "destructive"
        });
        return;
      }

      if (isNaN(salePrice) || salePrice <= 0) {
        form.setError('sale_price', {
          type: 'manual',
          message: 'Please enter a valid sale price'
        });
        toast({
          title: "Validation Error",
          description: "Please enter a valid sale price",
          variant: "destructive"
        });
        return;
      }

      if (!priceValidation.isValid) {
        form.setError('sale_price', {
          type: 'manual',
          message: priceValidation.error || 'Invalid pricing'
        });
        toast({
          title: "Pricing Error",
          description: priceValidation.error || 'Invalid pricing',
          variant: "destructive"
        });
        return;
      }

      const productData = {
        product_name: data.product_name.trim(),
        category: data.category,
        original_price: originalPrice,
        sale_price: salePrice,
        size: data.size?.trim() || null,
        badge_text: data.badge_text?.trim() || null,
        sale_id: saleId,
        product_image: imageUrl || null,
        position: product?.position || 0,
      };

      console.log('Submitting product data:', productData);

      if (product) {
        console.log('Updating existing product:', product.id);
        await updateProduct(product.id, productData);
      } else {
        console.log('Adding new product');
        await addProduct(productData);
      }

      console.log('Product operation completed successfully');
      onSuccess();
    } catch (error) {
      console.error('Failed to save product:', error);
      
      // Error is already handled in the optimistic hook, but we can add form-specific handling here
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
        } else if (error.message.includes('duplicate')) {
          toast({
            title: "Duplicate Error",
            description: "A product with this name already exists",
            variant: "destructive"
          });
        }
      }
    } finally {
      setSubmitting(false);
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
              rules={{ required: 'Original price is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="39.99"
                      {...field}
                      onChange={(e) => {
                        // Allow empty string to clear the field completely
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_price"
              rules={{ required: 'Sale price is required' }}
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
                      onChange={(e) => {
                        // Allow empty string to clear the field completely
                        field.onChange(e.target.value);
                      }}
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
                  <p className="text-xs text-gray-500">Leave empty for no badge</p>
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
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!priceValidation.isValid || uploading || submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Image Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={(open) => {
        if (!open && !uploading) {
          setShowCropModal(false);
          setSelectedFile(null);
          setImageSrc('');
        }
      }}>
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
                  if (!uploading) {
                    setShowCropModal(false);
                    setSelectedFile(null);
                    setImageSrc('');
                  }
                }}
                disabled={uploading}
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
