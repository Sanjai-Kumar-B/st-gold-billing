import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '@/types';

export class PDFService {
  static async generateInvoicePDF(invoice: Invoice, elementId: string): Promise<void> {
    try {
      // Get the invoice element
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Invoice element not found');
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123 // A4 height in pixels at 96 DPI
      });

      // Calculate dimensions for A4 page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const filename = `${invoice.invoiceNumber}_${invoice.customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async printInvoice(elementId: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Invoice element not found');
      }

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window. Please check your popup blocker.');
      }

      // Clone the invoice element
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create the print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - Print</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #000;
              background: white;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .invoice-container {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 20px !important;
                box-shadow: none !important;
                border: none !important;
              }
              
              .page-break {
                page-break-before: always;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            .invoice-container {
              width: 794px;
              margin: 0 auto;
              padding: 40px;
              background: white;
              min-height: 1123px;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .company-info h1 {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .company-info .subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 12px;
            }
            
            .company-info p {
              font-size: 12px;
              color: #374151;
              line-height: 1.5;
              margin-bottom: 4px;
            }
            
            .invoice-meta {
              text-align: right;
            }
            
            .invoice-meta h2 {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .invoice-meta p {
              font-size: 14px;
              color: #374151;
              margin-bottom: 4px;
            }
            
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 30px;
            }
            
            .detail-section h3 {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .detail-section p {
              font-size: 14px;
              color: #374151;
              margin-bottom: 6px;
              line-height: 1.4;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 12px;
            }
            
            .items-table th {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              padding: 12px 8px;
              text-align: left;
              font-weight: bold;
              color: #374151;
            }
            
            .items-table td {
              border: 1px solid #e5e7eb;
              padding: 10px 8px;
              color: #374151;
            }
            
            .items-table .text-right {
              text-align: right;
            }
            
            .items-table .text-center {
              text-align: center;
            }
            
            .calculations {
              margin-left: auto;
              width: 300px;
              margin-bottom: 30px;
            }
            
            .calculations table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
            
            .calculations td {
              padding: 8px 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .calculations .font-bold {
              font-weight: bold;
            }
            
            .calculations .text-right {
              text-align: right;
            }
            
            .calculations .grand-total {
              background-color: #f3f4f6;
              font-weight: bold;
              font-size: 16px;
            }
            
            .amount-in-words {
              margin-bottom: 30px;
              padding: 16px;
              background-color: #f9fafb;
              border-radius: 8px;
            }
            
            .amount-in-words p {
              font-size: 14px;
              color: #374151;
              font-weight: 500;
            }
            
            .invoice-footer {
              display: flex;
              justify-content: space-between;
              align-items: end;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            
            .footer-section {
              text-align: center;
            }
            
            .footer-section h4 {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 40px;
            }
            
            .footer-section .signature-line {
              border-top: 1px solid #374151;
              width: 150px;
              margin: 0 auto;
              padding-top: 8px;
            }
            
            .footer-section p {
              font-size: 11px;
              color: #374151;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } catch (error) {
      console.error('Error printing invoice:', error);
      throw new Error('Failed to print invoice. Please try again.');
    }
  }
}

export default PDFService;
