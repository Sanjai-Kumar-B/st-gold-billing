'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PlusCircle, FileText, Users, Settings, LogOut, Package } from 'lucide-react';

export default function Dashboard() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      title: 'Create New Invoice',
      description: 'Generate a new billing invoice',
      icon: PlusCircle,
      href: '/dashboard/invoice/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Invoice History',
      description: 'View and manage all invoices',
      icon: FileText,
      href: '/dashboard/invoices',
      color: 'bg-green-500',
    },
    {
      title: 'Customer Management',
      description: 'Manage customer database',
      icon: Users,
      href: '/dashboard/customers',
      color: 'bg-purple-500',
    },
    {
      title: 'Product Management',
      description: 'Manage products and pricing',
      icon: Package,
      href: '/dashboard/products',
      color: 'bg-orange-500',
    },
    {
      title: 'Settings',
      description: 'Configure company and billing settings',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ST Gold Covering</h1>
                <p className="text-sm text-gray-600">Billing Software</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Select an option below to get started</p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card key={item.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${item.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = item.href}
                    >
                      Open
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">0</div>
                <p className="text-sm text-gray-600">Invoices created today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹0</div>
                <p className="text-sm text-gray-600">Total revenue this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">0</div>
                <p className="text-sm text-gray-600">Registered customers</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
