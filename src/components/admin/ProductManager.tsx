
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Edit, Trash2, GripVertical } from 'lucide-react';
import { useSaleProducts } from '@/hooks/useSales';
import ProductForm from './ProductForm';
import { SaleProduct } from '@/types/sales';

interface ProductManagerProps {
  saleId: string;
}

const ProductManager: React.FC<ProductManagerProps> = ({ saleId }) => {
  const { products, loading, deleteProduct, reorderProducts } = useSaleProducts(saleId);
  const [editingProduct, setEditingProduct] = useState<SaleProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const calculateSavings = (original: number, sale: number) => {
    return (original - sale).toFixed(2);
  };

  const calculateSavingsPercent = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Products ({products.length})</h3>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                saleId={saleId}
                product={editingProduct}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setEditingProduct(null);
                }}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <p className="mb-4">No products added yet</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    saleId={saleId}
                    onSuccess={() => setIsDialogOpen(false)}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Savings</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.product_image && (
                          <img
                            src={product.product_image}
                            alt={product.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.product_name}</p>
                          {product.size && (
                            <p className="text-sm text-gray-500">{product.size}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 line-through">
                          ${product.original_price.toFixed(2)}
                        </p>
                        <p className="font-semibold text-green-600">
                          ${product.sale_price.toFixed(2)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-red-600">
                          Save ${calculateSavings(product.original_price, product.sale_price)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ({calculateSavingsPercent(product.original_price, product.sale_price)}% off)
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.badge_text && (
                        <Badge variant="secondary">{product.badge_text}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManager;
