
import { useState, useCallback, useEffect } from 'react';
import { SaleProduct } from '@/types/sales';
import { useSaleProducts } from './useSales';
import { useToast } from './use-toast';

interface PendingOperation {
  id: string;
  type: 'add' | 'update' | 'delete';
  timestamp: number;
}

export const useOptimisticSaleProducts = (saleId: string) => {
  const { products: serverProducts, addProduct, updateProduct, deleteProduct, reorderProducts, fetchProducts } = useSaleProducts(saleId);
  const [optimisticProducts, setOptimisticProducts] = useState<SaleProduct[]>([]);
  const [pendingOperations, setPendingOperations] = useState<Map<string, PendingOperation>>(new Map());
  const { toast } = useToast();

  // Sync with server products when they change
  useEffect(() => {
    setOptimisticProducts(serverProducts);
  }, [serverProducts]);

  // Use server products as the source of truth
  const products = optimisticProducts;

  const addOptimisticProduct = useCallback(async (productData: Omit<SaleProduct, 'id' | 'created_at' | 'updated_at'>) => {
    const tempId = `temp-${Date.now()}`;
    const tempProduct: SaleProduct = {
      ...productData,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update
    setOptimisticProducts(prev => [...prev, tempProduct]);
    setPendingOperations(prev => new Map(prev).set(tempId, {
      id: tempId,
      type: 'add',
      timestamp: Date.now()
    }));

    try {
      const savedProduct = await addProduct(productData);
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      // Rollback on failure
      setOptimisticProducts(prev => prev.filter(p => p.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPendingOperations(prev => {
        const newMap = new Map(prev);
        newMap.delete(tempId);
        return newMap;
      });
    }
  }, [addProduct, fetchProducts, toast]);

  const updateOptimisticProduct = useCallback(async (id: string, updates: Partial<SaleProduct>) => {
    // Find current product
    const currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    const updatedProduct = { ...currentProduct, ...updates };

    // Optimistic update
    setOptimisticProducts(prev => 
      prev.map(p => p.id === id ? updatedProduct : p)
    );
    
    setPendingOperations(prev => new Map(prev).set(id, {
      id,
      type: 'update',
      timestamp: Date.now()
    }));

    try {
      await updateProduct(id, updates);
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      // Rollback on failure
      setOptimisticProducts(prev => 
        prev.map(p => p.id === id ? currentProduct : p)
      );
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPendingOperations(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, [products, updateProduct, fetchProducts, toast]);

  const deleteOptimisticProduct = useCallback(async (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;

    // Optimistic update
    setOptimisticProducts(prev => prev.filter(p => p.id !== id));
    setPendingOperations(prev => new Map(prev).set(id, {
      id,
      type: 'delete',
      timestamp: Date.now()
    }));

    try {
      await deleteProduct(id);
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      // Rollback on failure
      setOptimisticProducts(prev => [...prev, productToDelete]);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPendingOperations(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, [products, deleteProduct, fetchProducts, toast]);

  const reorderOptimisticProducts = useCallback(async (productIds: string[]) => {
    const currentOrder = [...products];
    
    // Create reordered products array
    const reorderedProducts = productIds.map((id, index) => {
      const product = products.find(p => p.id === id);
      return product ? { ...product, position: index } : null;
    }).filter(Boolean) as SaleProduct[];

    // Optimistic update
    setOptimisticProducts(reorderedProducts);

    try {
      await reorderProducts(productIds);
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Products reordered successfully",
      });
    } catch (error) {
      // Rollback on failure
      setOptimisticProducts(currentOrder);
      toast({
        title: "Error",
        description: "Failed to reorder products. Please try again.",
        variant: "destructive"
      });
    }
  }, [products, reorderProducts, fetchProducts, toast]);

  const isPending = useCallback((id: string) => {
    return pendingOperations.has(id);
  }, [pendingOperations]);

  const getPendingOperation = useCallback((id: string) => {
    return pendingOperations.get(id);
  }, [pendingOperations]);

  return {
    products,
    addProduct: addOptimisticProduct,
    updateProduct: updateOptimisticProduct,
    deleteProduct: deleteOptimisticProduct,
    reorderProducts: reorderOptimisticProducts,
    isPending,
    getPendingOperation,
    pendingCount: pendingOperations.size
  };
};
