'use client';

import React from 'react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoiceTemplateProps {
  invoice: Invoice;
  showPrintButton?: boolean;
}

export default function InvoiceTemplate({ invoice, showPrintButton = true }: InvoiceTemplateProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white">
      {/* Print Button - Hidden in print */}
      {showPrintButton && (
        <div className="mb-4 no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 print:hidden"
          >
            Print Invoice
          </button>
        </div>
      )}

      {/* A4 Invoice Template */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-none">
        <div className="p-8 print:p-6" style={{ minHeight: '297mm' }}>
          {/* Header Section */}
          <div className="border-b-2 border-gray-300 pb-6 mb-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Company Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {invoice.company.name}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="whitespace-pre-line">{invoice.company.address}</div>
                  {invoice.company.phone && <div>Phone: {invoice.company.phone}</div>}
                  {invoice.company.email && <div>Email: {invoice.company.email}</div>}
                  <div className="font-semibold">GSTIN: {invoice.company.gstin}</div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h2>
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Invoice No:</span>
                    <span className="font-bold">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(invoice.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-semibold text-gray-900 mb-1">{invoice.customer.name}</div>
              <div className="text-sm text-gray-600 whitespace-pre-line mb-2">
                {invoice.customer.address}
              </div>
              {invoice.customer.gstin && (
                <div className="text-sm font-medium">GSTIN: {invoice.customer.gstin}</div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                    Product Description
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">
                    Stone Count
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">
                    Qty (Pcs)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">
                    Total Stones
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">
                    Rate (₹)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">
                      <div className="font-medium">{item.productName}</div>
                      {item.stoneType && (
                        <div className="text-xs text-gray-600">Stone Type: {item.stoneType}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        {item.pricingType === 'stone-based' ? 'Stone-Based Pricing' : 'Piece-Rate Pricing'}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                      {item.pricingType === 'stone-based' ? item.stoneCount || '-' : 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                      {item.pricingType === 'stone-based' ? item.totalStones || '-' : 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                      {item.pricingType === 'stone-based' 
                        ? `₹${invoice.settings.masterStonePrice}/stone`
                        : formatCurrency(item.pricePerPiece || 0)
                      }
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">
                      {item.pricingType === 'stone-based' 
                        ? formatCurrency((item.totalStones || 0) * invoice.settings.masterStonePrice)
                        : formatCurrency(item.totalAmount || 0)
                      }
                    </td>
                  </tr>
                ))}
                
                {/* Add empty rows if needed for better layout */}
                {Array.from({ length: Math.max(0, 5 - invoice.items.length) }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left side - Pricing breakdown (if stone-based items exist) */}
            <div>
              {invoice.calculations.totalStoneValue > 0 && (
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">Stone Pricing Details:</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Total Stones:</span>
                      <span className="font-medium">
                        {invoice.items
                          .filter(item => item.pricingType === 'stone-based')
                          .reduce((sum, item) => sum + (item.totalStones || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per Stone:</span>
                      <span className="font-medium">₹{invoice.settings.masterStonePrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Totals */}
            <div>
              <table className="w-full">
                <tbody>
                  {invoice.calculations.totalStoneValue > 0 && (
                    <tr>
                      <td className="text-right py-1 pr-4 text-sm">Stone-Based Total:</td>
                      <td className="text-right py-1 font-medium">
                        {formatCurrency(invoice.calculations.totalStoneValue)}
                      </td>
                    </tr>
                  )}
                  {invoice.calculations.totalPieceRateValue > 0 && (
                    <tr>
                      <td className="text-right py-1 pr-4 text-sm">Piece-Rate Total:</td>
                      <td className="text-right py-1 font-medium">
                        {formatCurrency(invoice.calculations.totalPieceRateValue)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t">
                    <td className="text-right py-1 pr-4 text-sm font-semibold">Gross Amount:</td>
                    <td className="text-right py-1 font-semibold">
                      {formatCurrency(invoice.calculations.grossAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-right py-1 pr-4 text-sm">CGST ({invoice.settings.cgstRate}%):</td>
                    <td className="text-right py-1 font-medium">
                      {formatCurrency(invoice.calculations.cgst)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-right py-1 pr-4 text-sm">SGST ({invoice.settings.sgstRate}%):</td>
                    <td className="text-right py-1 font-medium">
                      {formatCurrency(invoice.calculations.sgst)}
                    </td>
                  </tr>
                  {invoice.calculations.courierCharges && invoice.calculations.courierCharges > 0 && (
                    <tr>
                      <td className="text-right py-1 pr-4 text-sm">Courier Charges:</td>
                      <td className="text-right py-1 font-medium">
                        {formatCurrency(invoice.calculations.courierCharges)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-800">
                    <td className="text-right py-2 pr-4 text-lg font-bold">Grand Total:</td>
                    <td className="text-right py-2 text-lg font-bold">
                      {formatCurrency(invoice.calculations.grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">Amount in Words: </span>
              <span className="uppercase">{invoice.calculations.grandTotalInWords}</span>
            </div>
          </div>

          {/* Terms and Signature */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* Terms and Conditions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Payment due within 30 days of invoice date</div>
                <div>• Interest @18% per annum will be charged on overdue amounts</div>
                <div>• All disputes subject to local jurisdiction</div>
                <div>• Goods once sold will not be taken back</div>
              </div>
            </div>

            {/* Authorized Signature */}
            <div className="text-right">
              <div className="mb-16">
                <h4 className="font-semibold text-gray-900 mb-2">For {invoice.company.name}</h4>
              </div>
              <div className="border-t border-gray-400 pt-2">
                <div className="font-semibold">Authorized Signature</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8 border-t pt-4">
            This is a computer-generated invoice and does not require a physical signature.
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
