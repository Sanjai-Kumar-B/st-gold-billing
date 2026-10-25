'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Share } from 'lucide-react';
import { Invoice } from '@/types';

export default function InvoicePreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, create a sample invoice
    // In real app, you would fetch from Firebase using invoice ID from URL params
    const sampleInvoice: Invoice = {
      id: 'sample-invoice-1',
      invoiceNumber: 'INV001',
      date: new Date(),
      customer: {
        name: 'Sample Customer',
        address: 'Sample Address\nCity, State - 123456',
        gstin: 'GST123456789'
      },
      company: {
        name: 'ST Gold Covering',
        address: 'Your Company Address\nCity, State - PIN\nCountry',
        gstin: 'GSTIN123456789',
        phone: '+91 9876543210',
        email: 'info@stgoldcovering.com'
      },
      items: [
        {
          id: '1',
          productName: 'Gold Covering Earrings',
          pricingType: 'stone-based',
          stoneCount: 50,
          quantity: 2,
          totalStones: 100,
          stonePrice: 2.30,
          stoneType: 'Red'
        },
        {
          id: '2',
          productName: 'Simple Chain',
          pricingType: 'piece-rate',
          quantity: 3,
          pricePerPiece: 150,
          totalAmount: 450
        }
      ],
      calculations: {
        totalStoneValue: 230, // 100 stones * 2.30
        totalPieceRateValue: 450, // 3 * 150
        grossAmount: 680,
        cgst: 10.20, // 1.5% of 680
        sgst: 10.20, // 1.5% of 680
        courierCharges: 50,
        grandTotal: 750.40,
        grandTotalInWords: 'SEVEN HUNDRED FIFTY RUPEES AND FORTY PAISE ONLY'
      },
      settings: {
        masterStonePrice: 2.30,
        cgstRate: 1.5,
        sgstRate: 1.5
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user-id',
      status: 'draft'
    };

    setInvoice(sampleInvoice);
    setLoading(false);
  }, []);

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    alert('PDF download feature will be implemented next!');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share feature will be implemented next!');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!invoice) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Invoice Preview - {invoice.invoiceNumber}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => window.print()}>
                  Print Invoice
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Invoice Template */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <InvoiceTemplate invoice={invoice} showPrintButton={false} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
