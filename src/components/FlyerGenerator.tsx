import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer, AlertTriangle } from 'lucide-react';
import { useSales, useSaleProducts } from '@/hooks/useSales';
import { useThemes } from '@/hooks/useThemes';
import { ErrorBoundary, ErrorState } from '@/components/ui/error-boundary';
import { Sale, SaleProduct, Theme } from '@/types/sales';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface FlyerGeneratorProps {
  saleId: string;
}

const FlyerGenerator: React.FC<FlyerGeneratorProps> = ({ saleId }) => {
  const { sales } = useSales();
  const { products } = useSaleProducts(saleId);
  const { getThemeById } = useThemes();
  const flyerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sale = sales.find(s => s.id === saleId);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (sale?.theme_id) {
          const theme = await getThemeById(sale.theme_id);
          setCurrentTheme(theme);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading theme:', err);
        setError('Failed to load theme');
      }
    };
    loadTheme();
  }, [sale?.theme_id, getThemeById]);

  if (!sale) {
    return (
      <ErrorState
        title="Sale Not Found"
        message="The requested sale could not be found. Please check if the sale ID is correct."
      />
    );
  }

  // Use theme colors if available, fallback to sale colors
  const themeColors = currentTheme ? {
    background: currentTheme.background_color,
    accent: currentTheme.accent_color
  } : {
    background: sale.background_color,
    accent: sale.accent_color
  };

  const productsPerPage = 20; // 5 columns x 4 rows
  const pages = Math.ceil(products.length / productsPerPage);

  const generatePDFWithRetry = async (maxRetries = 3) => {
    if (!flyerRef.current) {
      toast({
        title: "Error",
        description: "Flyer content not ready for export",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        toast({
          title: "Generating PDF",
          description: `Attempt ${attempt}/${maxRetries} - This may take a moment for high-quality output...`,
        });

        // Pre-validate all images before generation
        const imageElements = flyerRef.current.querySelectorAll('img');
        await validateImages(imageElements);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        // Remove existing PDF if any pages were added
        pdf.deletePage(1);

        // Process pages in chunks to prevent memory issues
        const CHUNK_SIZE = 2;
        for (let i = 0; i < pages; i += CHUNK_SIZE) {
          const chunk = Math.min(CHUNK_SIZE, pages - i);
          
          for (let j = 0; j < chunk; j++) {
            const pageIndex = i + j;
            const pageElement = flyerRef.current.children[pageIndex] as HTMLElement;
            if (!pageElement) continue;

            // Show detailed progress
            toast({
              title: "Processing",
              description: `Generating page ${pageIndex + 1} of ${pages} (${Math.round(((pageIndex + 1) / pages) * 100)}%)`,
            });

            // Add memory cleanup delay for large flyers
            if (pageIndex > 0) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Capture with optimized settings
            const canvas = await html2canvas(pageElement, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: pageElement.scrollWidth,
              height: pageElement.scrollHeight,
              logging: false, // Disable console logs
              imageTimeout: 15000, // 15 second timeout for images
              onclone: (clonedDoc) => {
                // Ensure proper styling and hide broken images
                const clonedElement = clonedDoc.querySelector('[data-page]') as HTMLElement;
                if (clonedElement) {
                  clonedElement.style.width = '210mm';
                  clonedElement.style.minHeight = '297mm';
                  
                  // Hide broken images in cloned document
                  const brokenImages = clonedElement.querySelectorAll('img[src=""], img:not([src])');
                  brokenImages.forEach(img => {
                    (img as HTMLElement).style.display = 'none';
                  });
                }
              }
            });

            // Calculate dimensions to fit A4
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add new page
            pdf.addPage();
            
            // Add image to PDF with error handling
            try {
              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } catch (imgError) {
              console.warn(`Failed to add page ${pageIndex + 1} image:`, imgError);
              // Add a placeholder page instead of failing completely
              pdf.text(`Page ${pageIndex + 1} - Image Generation Failed`, 20, 20);
            }
          }
          
          // Cleanup after each chunk
          if (typeof window !== 'undefined' && window.gc) {
            window.gc(); // Force garbage collection if available
          }
        }

        // Generate filename with timestamp for uniqueness
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '');
        const fileName = `${sale.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flyer_${timestamp}.pdf`;
        
        // Save the PDF
        pdf.save(fileName);
        
        toast({
          title: "Success",
          description: "High-resolution PDF generated successfully!",
        });
        
        return; // Success, exit retry loop
        
      } catch (error) {
        console.error(`PDF generation attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          // Final attempt failed
          setError('Failed to generate PDF after multiple attempts. Please try again or use the print option.');
          
          toast({
            title: "PDF Generation Failed",
            description: "All attempts failed. Falling back to print dialog.",
            variant: "destructive"
          });
          
          // Fallback to print dialog
          setTimeout(() => window.print(), 1000);
        } else {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          
          toast({
            title: "Retrying",
            description: `Attempt ${attempt} failed. Retrying in ${attempt} second(s)...`,
            variant: "destructive"
          });
        }
      }
    }
    
    setIsGenerating(false);
  };

  // Image validation helper
  const validateImages = async (imageElements: NodeListOf<HTMLImageElement>): Promise<void> => {
    const validationPromises = Array.from(imageElements).map(img => {
      return new Promise<void>((resolve, reject) => {
        if (!img.src || img.src === '') {
          img.style.display = 'none';
          resolve();
          return;
        }
        
        const testImg = new Image();
        testImg.onload = () => resolve();
        testImg.onerror = () => {
          console.warn('Image failed to load:', img.src);
          img.style.display = 'none';
          resolve(); // Don't reject, just hide the image
        };
        testImg.src = img.src;
        
        // Timeout after 10 seconds
        setTimeout(() => {
          img.style.display = 'none';
          resolve();
        }, 10000);
      });
    });
    
    await Promise.all(validationPromises);
  };

  const generatePDF = () => generatePDFWithRetry();

  const printFlyer = () => {
    try {
      window.print();
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Print Error",
        description: "Unable to open print dialog. Please try again.",
        variant: "destructive"
      });
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
              style={{ backgroundColor: themeColors.accent }}
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
                crossOrigin="anonymous"
                onError={(e) => {
                  // Handle image load errors gracefully
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="text-gray-400 text-xs">Image Error</div>';
                }}
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
              style={{ backgroundColor: themeColors.background }}
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
        data-page={pageIndex}
        className="w-full bg-white flex flex-col"
        style={{ 
          minHeight: '297mm',
          width: '210mm',
          pageBreakAfter: pageIndex < pages - 1 ? 'always' : 'auto'
        }}
      >
        {/* Header */}
        <div 
          className="text-center py-8 text-white relative"
          style={{ backgroundColor: themeColors.background }}
        >
          {/* Theme Header Image */}
          {currentTheme?.header_image_url && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={currentTheme.header_image_url}
                alt={`${currentTheme.name} header`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  // Hide broken header images
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">MY LIQUOR</h1>
            <h2 className="text-2xl font-semibold mb-2">{sale.name}</h2>
            <p className="text-lg">
              {format(new Date(sale.start_date), 'MMMM do')} - {format(new Date(sale.end_date), 'MMMM do, yyyy')}
            </p>
            {currentTheme && (
              <p className="text-sm mt-2 opacity-80">{currentTheme.name} Theme</p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {renderProductGrid(pageProducts)}
        </div>

        {/* Footer */}
        <div 
          className="text-center py-6 text-white"
          style={{ backgroundColor: themeColors.accent }}
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
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Flyer Preview - {sale.name}</h3>
            {currentTheme && (
              <p className="text-sm text-gray-600 mt-1">Using {currentTheme.name} theme</p>
            )}
            {error && (
              <div className="flex items-center gap-1 text-sm text-amber-600 mt-1">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={printFlyer}
              disabled={isGenerating}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={generatePDF}
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating PDF...' : 'Export High-Res PDF'}
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
                width: 210mm;
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
              
              [data-page] {
                page-break-after: always;
              }
              
              [data-page]:last-child {
                page-break-after: auto;
              }
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
};

export default FlyerGenerator;
