import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GripVertical, Percent, Loader2 } from 'lucide-react';
import { useOptimisticSaleProducts } from '@/hooks/useOptimisticSales';
import { ErrorBoundary, ErrorState } from '@/components/ui/error-boundary';
import ProductForm from './ProductForm';
import { SaleProduct } from '@/types/sales';

interface DraggableProductManagerProps {
  saleId: string;
}

interface SortableProductItemProps {
  product: SaleProduct;
  isPending: boolean;
  onEdit: (product: SaleProduct) => void;
  onDelete: (productId: string) => void;
}

const SortableProductItem: React.FC<SortableProductItemProps> = ({
  product,
  isPending,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const calculateSavings = (original: number, sale: number) => {
    return (original - sale).toFixed(2);
  };

  const calculateSavingsPercent = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 ${isPending ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {product.product_image && (
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-16 h-16 object-cover rounded border"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{product.product_name}</h3>
          {product.size && (
            <p className="text-sm text-gray-500">{product.size}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="capitalize">
              {product.category}
            </Badge>
            {product.badge_text && (
              <Badge variant="secondary">{product.badge_text}</Badge>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 line-through">
              ${product.original_price.toFixed(2)}
            </p>
            <p className="font-semibold text-green-600">
              ${product.sale_price.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-600">
              Save ${calculateSavings(product.original_price, product.sale_price)}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Percent className="w-3 h-3" />
              {calculateSavingsPercent(product.original_price, product.sale_price)}% off
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            disabled={isPending}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DraggableProductManager: React.FC<DraggableProductManagerProps> = ({ saleId }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
    isPending,
    pendingCount
  } = useOptimisticSaleProducts(saleId);
  
  const [editingProduct, setEditingProduct] = useState<SaleProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((product) => product.id === active.id);
      const newIndex = products.findIndex((product) => product.id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      const reorderedIds = newProducts.map(p => p.id);
      
      reorderProducts(reorderedIds);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const handleEditProduct = (product: SaleProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Products ({products.length})</h3>
            <p className="text-sm text-gray-500">
              Drag and drop to reorder products
              {pendingCount > 0 && ` • ${pendingCount} pending changes`}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                saleId={saleId}
                product={editingProduct}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <p className="mb-4">No products added yet</p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                      saleId={saleId}
                      onSuccess={handleFormSuccess}
                      onCancel={handleFormCancel}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {products.map((product) => (
                  <SortableProductItem
                    key={product.id}
                    product={product}
                    isPending={isPending(product.id)}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DraggableProductManager;
