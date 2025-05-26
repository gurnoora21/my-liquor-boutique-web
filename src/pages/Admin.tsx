
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Settings, FileImage } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import SalesList from '@/components/admin/SalesList';
import CreateSaleForm from '@/components/admin/CreateSaleForm';
import ProductManager from '@/components/admin/ProductManager';
import FlyerGenerator from '@/components/FlyerGenerator';

const Admin = () => {
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sales');
  const { sales } = useSales();

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
          <TabsList className="grid w-full grid-cols-4">
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
              </CardHeader>
              <CardContent>
                {selectedSaleId ? (
                  <ProductManager saleId={selectedSaleId} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a sale from the Sales tab to manage products
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flyer">
            <Card>
              <CardHeader>
                <CardTitle>Flyer Preview & Export</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSaleId ? (
                  <FlyerGenerator saleId={selectedSaleId} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a sale from the Sales tab to preview the flyer
                  </div>
                )}
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
