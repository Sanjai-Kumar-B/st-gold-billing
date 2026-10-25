'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Plus, Trash2, Save, Eye, Calculator } from 'lucide-react';
import { InvoiceItem } from '@/types';
import { 
  convertNumberToWords, 
  formatCurrency, 
  calculateStoneBasedTotal, 
  calculatePieceRateTotal,
  calculateTax,
  formatDate
} from '@/lib/utils';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Invoice Basic Info
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Customer Info
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  
  // Company Info (this should come from settings)
  const [companyInfo] = useState({
    name: 'ST Gold Covering',
    address: 'Your Company Address\nCity, State - PIN',
    gstin: 'GSTIN123456789',
    phone: '+91 9876543210',
    email: 'info@stgoldcovering.com'
  });
  
  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  // Settings
  const [masterStonePrice, setMasterStonePrice] = useState(2.30);
  const [cgstRate] = useState(1.5);
  const [sgstRate] = useState(1.5);
  const [courierCharges, setCourierCharges] = useState(0);
  
  // Calculations
  const [calculations, setCalculations] = useState({
    totalStoneValue: 0,
    totalPieceRateValue: 0,
    grossAmount: 0,
    cgst: 0,
    sgst: 0,
    grandTotal: 0,
    grandTotalInWords: ''
  });

  // Generate invoice number on load
  useEffect(() => {
    setInvoiceNumber(`INV${Date.now().toString().slice(-6)}`);
  }, []);

  // Recalculate totals when items change
  useEffect(() => {
    calculateTotals();
  }, [items, masterStonePrice, courierCharges]);

  const calculateTotals = () => {
    let totalStoneValue = 0;
    let totalPieceRateValue = 0;

    items.forEach(item => {
      if (item.pricingType === 'stone-based' && item.stoneCount && item.quantity) {
        const { totalValue } = calculateStoneBasedTotal(
          item.stoneCount,
          item.quantity,
          masterStonePrice
        );
        totalStoneValue += totalValue;
      } else if (item.pricingType === 'piece-rate' && item.quantity && item.pricePerPiece) {
        totalPieceRateValue += calculatePieceRateTotal(item.quantity, item.pricePerPiece);
      }
    });

    const grossAmount = totalStoneValue + totalPieceRateValue;
    const cgst = calculateTax(grossAmount, cgstRate);
    const sgst = calculateTax(grossAmount, sgstRate);
    const grandTotal = grossAmount + cgst + sgst + courierCharges;

    setCalculations({
      totalStoneValue,
      totalPieceRateValue,
      grossAmount,
      cgst,
      sgst,
      grandTotal,
      grandTotalInWords: convertNumberToWords(grandTotal)
    });
  };

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productName: '',
      pricingType: 'stone-based',
      quantity: 1,
      stoneCount: 0,
      totalStones: 0,
      stonePrice: masterStonePrice,
      pricePerPiece: 0,
      totalAmount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate derived fields
        if (updatedItem.pricingType === 'stone-based') {
          if (updatedItem.stoneCount && updatedItem.quantity) {
            updatedItem.totalStones = updatedItem.stoneCount * updatedItem.quantity;
          }
        } else if (updatedItem.pricingType === 'piece-rate') {
          if (updatedItem.quantity && updatedItem.pricePerPiece) {
            updatedItem.totalAmount = updatedItem.quantity * updatedItem.pricePerPiece;
          }
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Save invoice to Firebase
      console.log('Saving invoice...', {
        invoiceNumber,
        date: new Date(invoiceDate),
        customer: {
          name: customerName,
          address: customerAddress,
          gstin: customerGstin
        },
        company: companyInfo,
        items,
        calculations,
        settings: {
          masterStonePrice,
          cgstRate,
          sgstRate
        }
      });
      
      // For now, just show success message
      alert('Invoice saved successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Navigate to preview page
    router.push('/dashboard/invoice/preview');
  };

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
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Create New Invoice</h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Invoice'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice Number
                      </label>
                      <Input
                        value={invoiceNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInvoiceNumber(e.target.value)}
                        placeholder="Invoice Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={invoiceDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInvoiceDate(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <Input
                      value={customerName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Enter customer address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN (Optional)
                    </label>
                    <Input
                      value={customerGstin}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerGstin(e.target.value)}
                      placeholder="Enter GSTIN"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Invoice Items</CardTitle>
                    <Button onClick={addNewItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Product Name
                            </label>
                            <Input
                              value={item.productName}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                updateItem(item.id, 'productName', e.target.value)
                              }
                              placeholder="Enter product name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pricing Type
                            </label>
                            <select
                              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              value={item.pricingType}
                              onChange={(e) => updateItem(item.id, 'pricingType', e.target.value)}
                            >
                              <option value="stone-based">Stone-Based Pricing</option>
                              <option value="piece-rate">Piece-Rate Pricing</option>
                            </select>
                          </div>
                        </div>

                        {item.pricingType === 'stone-based' ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stone Count
                              </label>
                              <Input
                                type="number"
                                value={item.stoneCount || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  updateItem(item.id, 'stoneCount', parseInt(e.target.value) || 0)
                                }
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity (Pieces)
                              </label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                                }
                                placeholder="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Stones
                              </label>
                              <Input
                                value={item.totalStones || 0}
                                readOnly
                                className="bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stone Type (Optional)
                              </label>
                              <Input
                                value={item.stoneType || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  updateItem(item.id, 'stoneType', e.target.value)
                                }
                                placeholder="e.g., Red, Mixed"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity (Pieces)
                              </label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                                }
                                placeholder="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price Per Piece (₹)
                              </label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.pricePerPiece || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  updateItem(item.id, 'pricePerPiece', parseFloat(e.target.value) || 0)
                                }
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Amount (₹)
                              </label>
                              <Input
                                value={formatCurrency(item.totalAmount || 0)}
                                readOnly
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {items.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No items added yet. Click "Add Item" to get started.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Calculations */}
            <div className="space-y-6">
              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Pricing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Master Stone Price (₹)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={masterStonePrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setMasterStonePrice(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Courier Charges (₹)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={courierCharges}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setCourierCharges(parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Calculations */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stone-Based Total:</span>
                    <span className="font-medium">{formatCurrency(calculations.totalStoneValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Piece-Rate Total:</span>
                    <span className="font-medium">{formatCurrency(calculations.totalPieceRateValue)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm text-gray-600">Gross Amount:</span>
                    <span className="font-medium">{formatCurrency(calculations.grossAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CGST (1.5%):</span>
                    <span className="font-medium">{formatCurrency(calculations.cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">SGST (1.5%):</span>
                    <span className="font-medium">{formatCurrency(calculations.sgst)}</span>
                  </div>
                  {courierCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Courier Charges:</span>
                      <span className="font-medium">{formatCurrency(courierCharges)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">{formatCurrency(calculations.grandTotal)}</span>
                  </div>
                  
                  {calculations.grandTotal > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">Amount in Words:</p>
                      <p className="text-sm font-medium">{calculations.grandTotalInWords}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
