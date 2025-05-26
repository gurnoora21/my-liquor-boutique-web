import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';
import { useSales, useSaleProducts } from '@/hooks/useSales';
import { Sale, SaleProduct, THEME_COLORS } from '@/types/sales';
import { format } from 'date-fns';

interface FlyerGeneratorProps {
  saleId: string;
}

const FlyerGenerator: React.FC<FlyerGeneratorProps> = ({ saleId }) => {
  const { sales } = useSales();
  const { products } = useSaleProducts(saleId);
  const flyerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const sale = sales.find(s => s.id === saleId);

  if (!sale) {
    return <div>Sale not found</div>;
  }

  const themeColors = THEME_COLORS[sale.theme];
  const productsPerPage = 20; // 5 columns x 4 rows
  const pages = Math.ceil(products.length / productsPerPage);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // This would integrate with a PDF generation library like jsPDF or html2canvas
      // For now, we'll open print dialog
      window.print();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateSavings = (original: number, sale: number) => {
    return (original - sale).toFixed(2);
  };

  const renderProductGrid = (pageProducts: SaleProduct[]) => (
    <div className="grid grid-cols-5 gap-4 p-6">
      {pageProducts.map((product) => (
        <div 
          key={product.id}
          className="bg-white rounded-lg border-2 border-gray-200 p-3 text-center relative overflow-hidden"
          style={{ minHeight: '280px' }}
        >
          {/* Badge */}
          {product.badge_text && (
            <div 
              className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded"
              style={{ backgroundColor: sale.accent_color }}
            >
              {product.badge_text}
            </div>
          )}

          {/* Product Image */}
          <div className="w-full h-24 mb-3 flex items-center justify-center bg-gray-50 rounded">
            {product.product_image ? (
              <img
                src={product.product_image}
                alt={product.product_name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-xs">No Image</div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm mb-2 text-gray-900 leading-tight">
            {product.product_name}
          </h3>

          {/* Size */}
          {product.size && (
            <p className="text-xs text-gray-600 mb-2">{product.size}</p>
          )}

          {/* Pricing */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 line-through">
              Reg. ${product.original_price.toFixed(2)}
            </p>
            <div 
              className="text-white font-bold text-lg px-2 py-1 rounded"
              style={{ backgroundColor: sale.background_color }}
            >
              ${product.sale_price.toFixed(2)}
            </div>
            <div 
              className="text-white text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: '#DC2626' }}
            >
              SAVE ${calculateSavings(product.original_price, product.sale_price)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPage = (pageIndex: number) => {
    const startIndex = pageIndex * productsPerPage;
    const pageProducts = products.slice(startIndex, startIndex + productsPerPage);

    return (
      <div 
        key={pageIndex}
        className="w-full min-h-screen bg-white flex flex-col"
        style={{ pageBreakAfter: pageIndex < pages - 1 ? 'always' : 'auto' }}
      >
        {/* Header */}
        <div 
          className="text-center py-8 text-white"
          style={{ backgroundColor: sale.background_color }}
        >
          <h1 className="text-4xl font-bold mb-2">MY LIQUOR</h1>
          <h2 className="text-2xl font-semibold mb-2">{sale.name}</h2>
          <p className="text-lg">
            {format(new Date(sale.start_date), 'MMMM do')} - {format(new Date(sale.end_date), 'MMMM do, yyyy')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {renderProductGrid(pageProducts)}
        </div>

        {/* Footer */}
        <div 
          className="text-center py-6 text-white"
          style={{ backgroundColor: sale.accent_color }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-xl font-bold mb-4">WE MATCH ALL DRAYTON VALLEY COMPETITOR FLYER PRICES</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">STORE HOURS</h4>
                <p>Monday - Saturday: 10 AM - 10 PM</p>
                <p>Sunday: 11 AM - 8 PM</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">PAYMENT METHODS</h4>
                <p>Interac • Visa • Mastercard • Amex</p>
                <p>Cash • Debit</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">CONTACT</h4>
                <p>Visit us in Drayton Valley</p>
                <p>19+ Valid ID Required</p>
              </div>
            </div>
            
            {pages > 1 && (
              <div className="mt-4 text-xs">
                Page {pageIndex + 1} of {pages}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Flyer Preview - {sale.name}</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generatePDF}
            disabled={isGenerating}
          >
            <Printer className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Print'}
          </Button>
          <Button 
            onClick={generatePDF}
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p>No products added to this sale yet.</p>
            <p className="text-sm">Add products in the Products tab to generate the flyer.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div ref={flyerRef} className="flyer-content">
            {Array.from({ length: pages }, (_, i) => renderPage(i))}
          </div>
        </div>
      )}

      <style>
        {`
          @media print {
            .flyer-content {
              width: 8.5in;
              margin: 0;
            }
            
            body * {
              visibility: hidden;
            }
            
            .flyer-content, .flyer-content * {
              visibility: visible;
            }
            
            .flyer-content {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FlyerGenerator;
