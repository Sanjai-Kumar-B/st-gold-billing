'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Download, Printer, Edit, FileText } from 'lucide-react';
import { Invoice } from '@/types';
import { enhancedInvoiceService } from '@/lib/firebase-service';
import { PDFService } from '@/lib/pdf-service';
import toast from 'react-hot-toast';

export default function InvoiceViewPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const invoiceData = await enhancedInvoiceService.getById(invoiceId);
      if (invoiceData) {
        setInvoice(invoiceData);
      } else {
        toast.error('Invoice not found');
        router.push('/dashboard/invoices');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoice:', error);
      toast.error('Failed to load invoice');
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    
    try {
      setDownloading(true);
      await PDFService.generateInvoicePDF(invoice, 'invoice-print-area');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!invoice) return;
    
    try {
      setPrinting(true);
      await PDFService.printInvoice('invoice-print-area');
      toast.success('Print dialog opened');
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    } finally {
      setPrinting(false);
    }
  };

  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date.seconds * 1000);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
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
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
            <p className="text-gray-600 mb-4">The requested invoice could not be found.</p>
            <Button onClick={() => router.push('/dashboard/invoices')}>
              Back to Invoices
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
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/invoices')}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <h1 className="text-xl font-semibold text-gray-900">
                    Invoice {invoice.invoiceNumber}
                  </h1>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/edit-invoice/${invoice.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  disabled={printing}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {printing ? 'Printing...' : 'Print'}
                </Button>
                <Button onClick={handleDownloadPDF} disabled={downloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              {/* Invoice Print Area */}
              <div id="invoice-print-area" className="invoice-container">
                {/* Invoice Header */}
                <div className="invoice-header">
                  <div className="company-info">
                    <h1>{invoice.company.name}</h1>
                    <p className="subtitle">Gold Covering Wholesale</p>
                    <p>{invoice.company.address}</p>
                    <p>GSTIN: {invoice.company.gstin}</p>
                    {invoice.company.phone && <p>Phone: {invoice.company.phone}</p>}
                    {invoice.company.email && <p>Email: {invoice.company.email}</p>}
                  </div>
                  <div className="invoice-meta">
                    <h2>INVOICE</h2>
                    <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> {formatDate(invoice.date)}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'finalized' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Customer and Company Details */}
                <div className="invoice-details">
                  <div className="detail-section">
                    <h3>Bill To:</h3>
                    <p><strong>{invoice.customer.name}</strong></p>
                    <p>{invoice.customer.address}</p>
                    {invoice.customer.gstin && <p>GSTIN: {invoice.customer.gstin}</p>}
                  </div>
                  <div className="detail-section">
                    <h3>Payment Terms:</h3>
                    <p>As per agreement</p>
                    <p>Master Stone Price: ₹{invoice.settings.masterStonePrice.toFixed(2)}</p>
                    <p>CGST: {invoice.settings.cgstRate}%</p>
                    <p>SGST: {invoice.settings.sgstRate}%</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Product Name</th>
                      <th>Pricing Type</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-right">Rate/Price</th>
                      <th className="text-right">Total Stones</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          {item.productName}
                          {item.stoneType && (
                            <div className="text-xs text-gray-600">Stone: {item.stoneType}</div>
                          )}
                        </td>
                        <td className="text-center">
                          {item.pricingType === 'stone-based' ? 'Stone Based' : 'Piece Rate'}
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">
                          {item.pricingType === 'stone-based' 
                            ? `${item.stoneCount} stones @ ₹${item.stonePrice?.toFixed(2)}`
                            : `₹${item.pricePerPiece?.toFixed(2)} per piece`
                          }
                        </td>
                        <td className="text-right">
                          {item.pricingType === 'stone-based' ? item.totalStones || 0 : '-'}
                        </td>
                        <td className="text-right">
                          ₹{((item.totalStones || 0) * (item.stonePrice || 0) + 
                             (item.quantity * (item.pricePerPiece || 0))).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Calculations */}
                <div className="calculations">
                  <table>
                    <tbody>
                      <tr>
                        <td>Stone Value:</td>
                        <td className="text-right">₹{invoice.calculations.totalStoneValue.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Piece Rate Value:</td>
                        <td className="text-right">₹{invoice.calculations.totalPieceRateValue.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Gross Amount:</td>
                        <td className="text-right font-bold">₹{invoice.calculations.grossAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>CGST ({invoice.settings.cgstRate}%):</td>
                        <td className="text-right">₹{invoice.calculations.cgst.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>SGST ({invoice.settings.sgstRate}%):</td>
                        <td className="text-right">₹{invoice.calculations.sgst.toFixed(2)}</td>
                      </tr>
                      {invoice.calculations.courierCharges && invoice.calculations.courierCharges > 0 && (
                        <tr>
                          <td>Courier Charges:</td>
                          <td className="text-right">₹{invoice.calculations.courierCharges.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="grand-total">
                        <td className="font-bold">Grand Total:</td>
                        <td className="text-right font-bold">₹{invoice.calculations.grandTotal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Amount in Words */}
                <div className="amount-in-words">
                  <p><strong>Amount in Words:</strong> {invoice.calculations.grandTotalInWords}</p>
                </div>

                {/* Invoice Footer */}
                <div className="invoice-footer">
                  <div className="footer-section">
                    <h4>Customer Signature</h4>
                    <div className="signature-line">
                      <p>Customer</p>
                    </div>
                  </div>
                  <div className="footer-section">
                    <h4>For {invoice.company.name}</h4>
                    <div className="signature-line">
                      <p>Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
