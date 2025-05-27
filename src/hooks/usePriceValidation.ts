import { useMemo, useState, useEffect } from 'react';
import { ProductCategory } from '@/types/sales';

export interface PriceValidationResult {
  isValid: boolean;
  savings: string;
  savingsPercent: number;
  error: string | null;
  warning: string | null;
  suggestion: string | null;
}

interface CategoryRules {
  minDiscount: number;
  maxDiscount: number;
  minPrice: number;
  maxPrice: number;
}

const CATEGORY_RULES: Record<ProductCategory, CategoryRules> = {
  spirits: { minDiscount: 5, maxDiscount: 50, minPrice: 10, maxPrice: 2000 },
  wine: { minDiscount: 10, maxDiscount: 60, minPrice: 8, maxPrice: 500 },
  beer: { minDiscount: 5, maxDiscount: 40, minPrice: 1, maxPrice: 100 },
  coolers: { minDiscount: 5, maxDiscount: 45, minPrice: 2, maxPrice: 50 },
  mixers: { minDiscount: 10, maxDiscount: 50, minPrice: 1, maxPrice: 20 },
  accessories: { minDiscount: 15, maxDiscount: 70, minPrice: 5, maxPrice: 200 }
};

export const usePriceValidation = (
  originalPrice: number, 
  salePrice: number, 
  category: ProductCategory = 'spirits'
): PriceValidationResult => {
  return useMemo(() => {
    const savings = originalPrice - salePrice;
    const rules = CATEGORY_RULES[category];
    let isValid = true;
    let error: string | null = null;
    let warning: string | null = null;
    let suggestion: string | null = null;

    // Basic validation rules
    if (salePrice <= 0) {
      isValid = false;
      error = 'Sale price must be greater than $0';
    } else if (salePrice >= originalPrice) {
      isValid = false;
      error = 'Sale price must be lower than original price';
    } else if (originalPrice <= 0) {
      isValid = false;
      error = 'Original price must be greater than $0';
    } else if (originalPrice < rules.minPrice) {
      isValid = false;
      error = `${category} products should be priced at least $${rules.minPrice}`;
    } else if (originalPrice > rules.maxPrice) {
      warning = `Unusually high price for ${category} (typically under $${rules.maxPrice})`;
    }

    // Advanced validation rules
    if (isValid) {
      const savingsPercent = (savings / originalPrice) * 100;
      
      if (savingsPercent < rules.minDiscount) {
        warning = `Small discount for ${category} - consider at least ${rules.minDiscount}% off`;
        suggestion = `Try $${(originalPrice * (1 - rules.minDiscount / 100)).toFixed(2)} for ${rules.minDiscount}% off`;
      } else if (savingsPercent > rules.maxDiscount) {
        isValid = false;
        error = `Discount too high for ${category} (max ${rules.maxDiscount}%)`;
        suggestion = `Maximum recommended: $${(originalPrice * (1 - rules.maxDiscount / 100)).toFixed(2)}`;
      }

      // Pricing psychology suggestions
      if (isValid && savingsPercent >= rules.minDiscount && savingsPercent <= rules.maxDiscount) {
        const endDigits = salePrice.toFixed(2).slice(-2);
        if (!['99', '95', '89', '49'].includes(endDigits)) {
          suggestion = `Consider ending price in .99 or .95 for better appeal`;
        }
      }

      // Detect potential pricing errors
      if (isValid) {
        const priceRatio = salePrice / originalPrice;
        if (priceRatio < 0.2) {
          warning = 'Very aggressive discount - double-check pricing accuracy';
        } else if (Math.abs(salePrice - Math.round(salePrice)) < 0.01 && salePrice > 20) {
          suggestion = 'Consider psychological pricing (e.g., $${salePrice - 0.01})';
        }
      }
    }

    const savingsPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

    return {
      isValid,
      savings: savings.toFixed(2),
      savingsPercent,
      error,
      warning,
      suggestion
    };
  }, [originalPrice, salePrice, category]);
};

// Debounced version for real-time validation
export const useDebouncedPriceValidation = (
  originalPrice: number,
  salePrice: number,
  category: ProductCategory = 'spirits',
  delay: number = 300
) => {
  const [debouncedOriginal, setDebouncedOriginal] = useState(originalPrice);
  const [debouncedSale, setDebouncedSale] = useState(salePrice);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOriginal(originalPrice);
      setDebouncedSale(salePrice);
    }, delay);

    return () => clearTimeout(timer);
  }, [originalPrice, salePrice, delay]);

  return usePriceValidation(debouncedOriginal, debouncedSale, category);
};
