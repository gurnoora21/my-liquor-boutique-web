
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleProduct } from '@/types/sales';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  const getActiveSale = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      console.error('Error fetching active sale:', err);
      return null;
    }
  };

  const createSale = async (saleData: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([saleData])
        .select()
        .single();

      if (error) throw error;
      await fetchSales();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sale');
      throw err;
    }
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSales();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sale');
      throw err;
    }
  };

  const activateSale = async (id: string) => {
    try {
      // First deactivate all other sales
      await supabase
        .from('sales')
        .update({ is_active: false })
        .neq('id', id);

      // Then activate the selected sale
      const { data, error } = await supabase
        .from('sales')
        .update({ is_active: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSales();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate sale');
      throw err;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    fetchSales,
    getActiveSale,
    createSale,
    updateSale,
    activateSale
  };
};

export const useSaleProducts = (saleId?: string) => {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!saleId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sale_products')
        .select('*')
        .eq('sale_id', saleId)
        .order('position', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<SaleProduct, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sale_products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      await fetchProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<SaleProduct>) => {
    try {
      const { data, error } = await supabase
        .from('sale_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sale_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  const reorderProducts = async (productIds: string[]) => {
    try {
      const updates = productIds.map((id, index) => ({
        id,
        position: index
      }));

      for (const update of updates) {
        await supabase
          .from('sale_products')
          .update({ position: update.position })
          .eq('id', update.id);
      }

      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder products');
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [saleId]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts
  };
};
