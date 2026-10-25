// Database Types
export interface Customer {
  id?: string;
  name: string;
  address: string;
  gstin?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id?: string;
  name: string;
  category: 'Earrings' | 'Necklaces' | 'Bracelets' | 'Rings' | 'Bangles' | 'Anklets' | 'Chains' | 'Pendants' | 'Other';
  stoneType: 'Full Red' | 'Mixed Stones' | 'Blue Stones' | 'Green Stones' | 'Premium Mix' | 'Other';
  pricingType: 'stone_based' | 'piece_rate';
  stonePrice?: number; // For stone-based pricing
  pieceRate?: number; // For piece-rate pricing
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Types
export interface InvoiceItem {
  id: string;
  productName: string;
  pricingType: 'stone-based' | 'piece-rate';
  
  // Stone-based pricing fields
  stoneCount?: number;
  quantity: number;
  totalStones?: number; // stoneCount * quantity
  stonePrice?: number; // per stone price
  stoneType?: string;
  
  // Piece-rate pricing fields
  pricePerPiece?: number;
  totalAmount?: number; // quantity * pricePerPiece
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  date: Date;
  
  // Customer details
  customer: {
    name: string;
    address: string;
    gstin?: string;
  };
  
  // Company details
  company: {
    name: string;
    address: string;
    gstin: string;
    phone?: string;
    email?: string;
  };
  
  // Invoice items
  items: InvoiceItem[];
  
  // Calculations
  calculations: {
    totalStoneValue: number;
    totalPieceRateValue: number;
    grossAmount: number;
    cgst: number; // 1.5%
    sgst: number; // 1.5%
    courierCharges?: number;
    grandTotal: number;
    grandTotalInWords: string;
  };
  
  // Settings used for this invoice
  settings: {
    masterStonePrice: number;
    cgstRate: number;
    sgstRate: number;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // user ID
  status: 'draft' | 'finalized' | 'paid';
}

// Settings Types
export interface CompanySettings {
  id?: string;
  name: string;
  address: string;
  gstin: string;
  phone?: string;
  email?: string;
  logo?: string;
  updatedAt: Date;
}

export interface BillingSettings {
  id?: string;
  masterStonePrice: number;
  cgstRate: number;
  sgstRate: number;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  updatedAt: Date;
}

export interface StoneTypeSettings {
  id?: string;
  stoneTypes: {
    name: string;
    priceMultiplier: number; // Multiplier for master stone price
    color: string;
    isActive: boolean;
  }[];
  updatedAt: Date;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin: Date;
}
