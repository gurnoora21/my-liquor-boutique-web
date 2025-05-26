
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Pause, Edit, Trash2 } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { Sale } from '@/types/sales';
import { format } from 'date-fns';

interface SalesListProps {
  onSelectSale: (saleId: string) => void;
  selectedSaleId: string | null;
}

const SalesList: React.FC<SalesListProps> = ({ onSelectSale, selectedSaleId }) => {
  const { sales, loading, activateSale } = useSales();

  const handleActivate = async (saleId: string) => {
    try {
      await activateSale(saleId);
    } catch (error) {
      console.error('Failed to activate sale:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading sales...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow 
              key={sale.id}
              className={selectedSaleId === sale.id ? 'bg-blue-50' : ''}
            >
              <TableCell className="font-medium">{sale.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {sale.theme.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(sale.start_date), 'MMM dd')} - {format(new Date(sale.end_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Badge variant={sale.is_active ? 'default' : 'secondary'}>
                  {sale.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSale(sale.id)}
                    className={selectedSaleId === sale.id ? 'bg-blue-100' : ''}
                  >
                    {selectedSaleId === sale.id ? 'Selected' : 'Select'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActivate(sale.id)}
                    disabled={sale.is_active}
                  >
                    {sale.is_active ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {sales.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sales created yet. Create your first sale to get started.
        </div>
      )}
    </div>
  );
};

export default SalesList;
