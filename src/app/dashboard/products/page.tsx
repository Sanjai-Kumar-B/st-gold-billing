'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Package, Tag } from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/lib/firebase-service';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stoneCount: 0,
    pricePerPiece: 0,
    stoneType: 'red' as 'red' | 'mixed' | 'blue' | 'green' | 'other',
    isActive: true
  });

  const categories = [
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Rings',
    'Pendants',
    'Chains',
    'Sets',
    'Other'
  ];

  const stoneTypes = [
    { value: 'red', label: 'Red Stones' },
    { value: 'mixed', label: 'Mixed Stones' },
    { value: 'blue', label: 'Blue Stones' },
    { value: 'green', label: 'Green Stones' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      const productList = await productService.getAll();
      setProducts(productList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error('Name and category are required');
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        await productService.update(editingProduct.id!, formData);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const productData = {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await productService.create(productData);
        toast.success('Product added successfully');
      }
      
      // Reset form and reload products
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      stoneCount: product.stoneCount || 0,
      pricePerPiece: product.pricePerPiece || 0,
      stoneType: product.stoneType || 'red',
      isActive: product.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.delete(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      await productService.update(product.id!, { isActive: !product.isActive });
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully`);
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      stoneCount: 0,
      pricePerPiece: 0,
      stoneType: 'red',
      isActive: true
    });
    setShowAddForm(false);
    setEditingProduct(null);
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
                  <Package className="h-6 w-6 text-blue-600 mr-2" />
                  <h1 className="text-xl font-semibold text-gray-900">Product Management</h1>
                </div>
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Add/Edit Product Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stone Count (for stone-based pricing)
                      </label>
                      <Input
                        type="number"
                        value={formData.stoneCount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormData({ ...formData, stoneCount: parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Piece (for piece-rate pricing)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.pricePerPiece}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setFormData({ ...formData, pricePerPiece: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stone Type
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={formData.stoneType}
                        onChange={(e) => setFormData({ ...formData, stoneType: e.target.value as any })}
                      >
                        {stoneTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Product is active
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Products ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No products found matching your search.' : 'No products added yet. Click "Add Product" to get started.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${!product.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <div className="flex items-center mt-1">
                            <Tag className="h-3 w-3 text-gray-500 mr-1" />
                            <span className="text-xs text-gray-500">{product.category}</span>
                            {!product.isActive && (
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {product.description && (
                          <div className="text-xs text-gray-500 mb-2">{product.description}</div>
                        )}
                        
                        {product.stoneCount && product.stoneCount > 0 && (
                          <div><span className="font-medium">Stone Count:</span> {product.stoneCount}</div>
                        )}
                        
                        {product.pricePerPiece && product.pricePerPiece > 0 && (
                          <div><span className="font-medium">Price per Piece:</span> ₹{product.pricePerPiece}</div>
                        )}
                        
                        {product.stoneType && (
                          <div><span className="font-medium">Stone Type:</span> {stoneTypes.find(t => t.value === product.stoneType)?.label}</div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductStatus(product)}
                          className={product.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {product.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <span className={`text-xs px-2 py-1 rounded ${product.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
