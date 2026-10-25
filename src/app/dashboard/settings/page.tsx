'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Settings, Building, Calculator, Palette, Save, Plus } from 'lucide-react';
import { CompanySettings, BillingSettings, StoneTypeSettings } from '@/types';
import { companySettingsService, billingSettingsService, stoneTypeSettingsService } from '@/lib/firebase-service';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Company Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'ST Gold Covering',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    updatedAt: new Date()
  });

  // Billing Settings
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    masterStonePrice: 2.30,
    cgstRate: 1.5,
    sgstRate: 1.5,
    invoicePrefix: 'INV',
    nextInvoiceNumber: 1,
    updatedAt: new Date()
  });

  // Stone Type Settings
  const [stoneTypeSettings, setStoneTypeSettings] = useState<StoneTypeSettings>({
    stoneTypes: [
      { name: 'Full Red', priceMultiplier: 1.0, color: '#ef4444', isActive: true },
      { name: 'Mixed Stones', priceMultiplier: 1.2, color: '#8b5cf6', isActive: true },
      { name: 'Blue Stones', priceMultiplier: 1.1, color: '#3b82f6', isActive: true },
      { name: 'Green Stones', priceMultiplier: 1.1, color: '#10b981', isActive: true },
      { name: 'Premium Mix', priceMultiplier: 1.5, color: '#f59e0b', isActive: true }
    ],
    updatedAt: new Date()
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load company settings
      const company = await companySettingsService.getSettings();
      if (company) {
        setCompanySettings(company);
      }

      // Load billing settings
      const billing = await billingSettingsService.getSettings();
      if (billing) {
        setBillingSettings(billing);
      }

      // Load stone type settings
      const stoneTypes = await stoneTypeSettingsService.getSettings();
      if (stoneTypes) {
        setStoneTypeSettings(stoneTypes);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
      
      // Save company settings
      await companySettingsService.updateSettings(companySettings);
      
      // Save billing settings
      await billingSettingsService.updateSettings(billingSettings);
      
      // Save stone type settings
      await stoneTypeSettingsService.updateSettings(stoneTypeSettings);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addStoneType = () => {
    setStoneTypeSettings({
      ...stoneTypeSettings,
      stoneTypes: [
        ...stoneTypeSettings.stoneTypes,
        {
          name: '',
          priceMultiplier: 1.0,
          color: '#6b7280',
          isActive: true
        }
      ]
    });
  };

  const updateStoneType = (index: number, field: string, value: any) => {
    const updatedStoneTypes = [...stoneTypeSettings.stoneTypes];
    updatedStoneTypes[index] = {
      ...updatedStoneTypes[index],
      [field]: value
    };
    setStoneTypeSettings({
      ...stoneTypeSettings,
      stoneTypes: updatedStoneTypes
    });
  };

  const removeStoneType = (index: number) => {
    const updatedStoneTypes = stoneTypeSettings.stoneTypes.filter((_, i) => i !== index);
    setStoneTypeSettings({
      ...stoneTypeSettings,
      stoneTypes: updatedStoneTypes
    });
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
                <div className="flex items-center">
                  <Settings className="h-6 w-6 text-blue-600 mr-2" />
                  <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                </div>
              </div>
              <Button onClick={saveAllSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save All Settings'}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <Input
                    value={companySettings.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCompanySettings({ ...companySettings, name: e.target.value })
                    }
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN *
                  </label>
                  <Input
                    value={companySettings.gstin}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCompanySettings({ ...companySettings, gstin: e.target.value })
                    }
                    placeholder="Enter GSTIN"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  placeholder="Enter complete company address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={companySettings.phone || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCompanySettings({ ...companySettings, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={companySettings.email || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCompanySettings({ ...companySettings, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Billing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Master Stone Price (₹)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={billingSettings.masterStonePrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setBillingSettings({ ...billingSettings, masterStonePrice: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="2.30"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CGST Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={billingSettings.cgstRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setBillingSettings({ ...billingSettings, cgstRate: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="1.5"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SGST Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={billingSettings.sgstRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setBillingSettings({ ...billingSettings, sgstRate: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="1.5"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Prefix
                  </label>
                  <Input
                    value={billingSettings.invoicePrefix}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setBillingSettings({ ...billingSettings, invoicePrefix: e.target.value })
                    }
                    placeholder="INV"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Invoice Number
                  </label>
                  <Input
                    type="number"
                    value={billingSettings.nextInvoiceNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setBillingSettings({ ...billingSettings, nextInvoiceNumber: parseInt(e.target.value) || 1 })
                    }
                    placeholder="1"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Next invoice will be: {billingSettings.invoicePrefix}{billingSettings.nextInvoiceNumber.toString().padStart(4, '0')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stone Type Settings */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Stone Type Configuration
                </CardTitle>
                <Button onClick={addStoneType} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stone Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stoneTypeSettings.stoneTypes.map((stoneType, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stone Type Name
                        </label>
                        <Input
                          value={stoneType.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            updateStoneType(index, 'name', e.target.value)
                          }
                          placeholder="e.g., Full Red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Multiplier
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={stoneType.priceMultiplier}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            updateStoneType(index, 'priceMultiplier', parseFloat(e.target.value) || 1)
                          }
                          placeholder="1.0"
                          min="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={stoneType.color}
                            onChange={(e) => updateStoneType(index, 'color', e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <Input
                            value={stoneType.color}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              updateStoneType(index, 'color', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={stoneType.isActive}
                          onChange={(e) => updateStoneType(index, 'isActive', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-700">Active</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStoneType(index)}
                          className="text-red-600 hover:text-red-700 ml-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Effective price: ₹{(billingSettings.masterStonePrice * stoneType.priceMultiplier).toFixed(2)} per stone
                    </div>
                  </div>
                ))}
                
                {stoneTypeSettings.stoneTypes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No stone types configured. Click "Add Stone Type" to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveAllSettings} disabled={saving} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving All Settings...' : 'Save All Settings'}
            </Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
