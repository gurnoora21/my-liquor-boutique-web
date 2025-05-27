
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Settings, FileImage, Palette } from 'lucide-react';
import { useSalesRealtime } from '@/hooks/useSalesRealtime';
import SalesList from '@/components/admin/SalesList';
import CreateSaleForm from '@/components/admin/CreateSaleForm';
import ProductManager from '@/components/admin/ProductManager';
import FlyerGenerator from '@/components/FlyerGenerator';
import ThemeManager from '@/components/admin/ThemeManager';

const Admin = () => {
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sales');
  const { sales, loading } = useSalesRealtime();

  // Auto-select the first sale or active sale when sales are loaded
  useEffect(() => {
    if (!loading && sales.length > 0 && !selectedSaleId) {
      // Try to find an active sale first, otherwise select the first sale
      const activeSale = sales.find(sale => sale.is_active);
      const saleToSelect = activeSale || sales[0];
      setSelectedSaleId(saleToSelect.id);
    }
  }, [sales, loading, selectedSaleId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Flyer Management Dashboard
          </h1>
          <p className="text-gray-600">
            Create, manage, and generate automated sales flyers
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="flyer" className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Flyer Preview
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Sale
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesList 
                  onSelectSale={setSelectedSaleId}
                  selectedSaleId={selectedSaleId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                {selectedSaleId && (
                  <p className="text-sm text-gray-600">
                    Managing products for: {sales.find(s => s.id === selectedSaleId)?.name || 'Selected Sale'}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {selectedSaleId ? (
                  <ProductManager saleId={selectedSaleId} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {loading ? (
                      <p>Loading sales...</p>
                    ) : sales.length === 0 ? (
                      <div>
                        <p className="mb-4">No sales found. Create a sale first to manage products.</p>
                        <Button onClick={() => setActiveTab('create')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Sale
                        </Button>
                      </div>
                    ) : (
                      <p>Please select a sale from the Sales tab to manage products</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flyer">
            <Card>
              <CardHeader>
                <CardTitle>Flyer Preview & Export</CardTitle>
                {selectedSaleId && (
                  <p className="text-sm text-gray-600">
                    Previewing flyer for: {sales.find(s => s.id === selectedSaleId)?.name || 'Selected Sale'}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {selectedSaleId ? (
                  <FlyerGenerator saleId={selectedSaleId} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {loading ? (
                      <p>Loading sales...</p>
                    ) : sales.length === 0 ? (
                      <div>
                        <p className="mb-4">No sales found. Create a sale first to preview flyers.</p>
                        <Button onClick={() => setActiveTab('create')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Sale
                        </Button>
                      </div>
                    ) : (
                      <p>Please select a sale from the Sales tab to preview the flyer</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="themes">
            <Card>
              <CardHeader>
                <CardTitle>Theme Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ThemeManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateSaleForm onSuccess={() => setActiveTab('sales')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
