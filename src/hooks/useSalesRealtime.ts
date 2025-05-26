
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleProduct } from '@/types/sales';

export const useSalesRealtime = () => {
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

  const getSaleWithTheme = async (saleId: string) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          themes (
            id,
            name,
            background_color,
            accent_color,
            header_image_url
          )
        `)
        .eq('id', saleId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching sale with theme:', err);
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
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate sale');
      throw err;
    }
  };

  useEffect(() => {
    fetchSales();

    // Set up real-time subscription for sales
    const salesChannel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        (payload) => {
          console.log('Sales change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setSales(prev => [payload.new as Sale, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSales(prev => prev.map(sale => 
              sale.id === payload.new.id ? payload.new as Sale : sale
            ));
          } else if (payload.eventType === 'DELETE') {
            setSales(prev => prev.filter(sale => sale.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salesChannel);
    };
  }, []);

  return {
    sales,
    loading,
    error,
    fetchSales,
    getActiveSale,
    getSaleWithTheme,
    createSale,
    updateSale,
    activateSale
  };
};

export const useSaleProductsRealtime = (saleId?: string) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder products');
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();

    if (!saleId) return;

    // Set up real-time subscription for sale products
    const productsChannel = supabase
      .channel(`products-${saleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sale_products',
          filter: `sale_id=eq.${saleId}`
        },
        (payload) => {
          console.log('Product change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, payload.new as SaleProduct].sort((a, b) => a.position - b.position));
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(product => 
              product.id === payload.new.id ? payload.new as SaleProduct : product
            ).sort((a, b) => a.position - b.position));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(product => product.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
    };
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
