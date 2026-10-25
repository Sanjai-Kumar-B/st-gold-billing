import toWords from 'number-to-words';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertNumberToWords(amount: number): string {
  if (amount === 0) return 'Zero Rupees Only';
  
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = '';
  
  if (rupees > 0) {
    result += toWords.toWords(rupees).toUpperCase() + ' RUPEES';
  }
  
  if (paise > 0) {
    if (result) result += ' AND ';
    result += toWords.toWords(paise).toUpperCase() + ' PAISE';
  }
  
  result += ' ONLY';
  
  return result;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

export function generateInvoiceNumber(prefix: string = 'INV', number: number): string {
  return `${prefix}${number.toString().padStart(4, '0')}`;
}

export function calculateTax(amount: number, rate: number): number {
  return (amount * rate) / 100;
}

export function calculateStoneBasedTotal(
  stoneCount: number,
  quantity: number,
  stonePrice: number
): {
  totalStones: number;
  totalValue: number;
} {
  const totalStones = stoneCount * quantity;
  const totalValue = totalStones * stonePrice;
  
  return { totalStones, totalValue };
}

export function calculatePieceRateTotal(
  quantity: number,
  pricePerPiece: number
): number {
  return quantity * pricePerPiece;
}

export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}
