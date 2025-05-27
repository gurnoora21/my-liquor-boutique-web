
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

    console.log('Adding product with data:', productData);

    // Optimistic update
    setOptimisticProducts(prev => [...prev, tempProduct]);
    setPendingOperations(prev => new Map(prev).set(tempId, {
      id: tempId,
      type: 'add',
      timestamp: Date.now()
    }));

    try {
      console.log('Attempting to save product to database...');
      const savedProduct = await addProduct(productData);
      console.log('Product saved successfully:', savedProduct);
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error('Failed to save product:', error);
      
      // Rollback on failure
      setOptimisticProducts(prev => prev.filter(p => p.id !== tempId));
      
      // Enhanced error messaging
      let errorMessage = "Failed to add product. Please try again.";
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        if (error.message.includes('row-level security')) {
          errorMessage = "Database permission error. Please contact support.";
        } else if (error.message.includes('violates')) {
          errorMessage = "Data validation error. Please check your input.";
        } else {
          errorMessage = `Failed to add product: ${error.message}`;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error; // Re-throw to handle in the form
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

    console.log('Updating product:', id, 'with updates:', updates);

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
      console.log('Attempting to update product in database...');
      await updateProduct(id, updates);
      console.log('Product updated successfully');
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error('Failed to update product:', error);
      
      // Rollback on failure
      setOptimisticProducts(prev => 
        prev.map(p => p.id === id ? currentProduct : p)
      );
      
      let errorMessage = "Failed to update product. Please try again.";
      if (error instanceof Error) {
        errorMessage = `Failed to update product: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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

    console.log('Deleting product:', id);

    // Optimistic update
    setOptimisticProducts(prev => prev.filter(p => p.id !== id));
    setPendingOperations(prev => new Map(prev).set(id, {
      id,
      type: 'delete',
      timestamp: Date.now()
    }));

    try {
      console.log('Attempting to delete product from database...');
      await deleteProduct(id);
      console.log('Product deleted successfully');
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      
      // Rollback on failure
      setOptimisticProducts(prev => [...prev, productToDelete]);
      
      let errorMessage = "Failed to delete product. Please try again.";
      if (error instanceof Error) {
        errorMessage = `Failed to delete product: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
    
    console.log('Reordering products:', productIds);
    
    // Create reordered products array
    const reorderedProducts = productIds.map((id, index) => {
      const product = products.find(p => p.id === id);
      return product ? { ...product, position: index } : null;
    }).filter(Boolean) as SaleProduct[];

    // Optimistic update
    setOptimisticProducts(reorderedProducts);

    try {
      console.log('Attempting to reorder products in database...');
      await reorderProducts(productIds);
      console.log('Products reordered successfully');
      
      // Refresh the products list from server to ensure consistency
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Products reordered successfully",
      });
    } catch (error) {
      console.error('Failed to reorder products:', error);
      
      // Rollback on failure
      setOptimisticProducts(currentOrder);
      
      let errorMessage = "Failed to reorder products. Please try again.";
      if (error instanceof Error) {
        errorMessage = `Failed to reorder products: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
