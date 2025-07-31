import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  ShoppingCart
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  sold: number;
  revenue: number;
  isActive: boolean;
  description: string;
  image?: string;
}

const ProductsInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Supplements',
    price: '',
    cost: '',
    stock: '',
    minStock: '10',
    description: '',
    isActive: true
  });

  const categories = ['Supplements', 'Equipment', 'Apparel', 'Accessories', 'Beverages', 'Snacks'];

  useEffect(() => {
    // Mock data for demo
    setProducts([
      {
        id: '1',
        name: 'Whey Protein Powder',
        category: 'Supplements',
        price: 49.99,
        cost: 25.00,
        stock: 45,
        minStock: 10,
        sold: 128,
        revenue: 6399.72,
        isActive: true,
        description: 'Premium whey protein for muscle building'
      },
      {
        id: '2',
        name: 'Resistance Bands Set',
        category: 'Equipment',
        price: 29.99,
        cost: 12.00,
        stock: 23,
        minStock: 15,
        sold: 67,
        revenue: 2009.33,
        isActive: true,
        description: 'Complete set of resistance bands for home workouts'
      },
      {
        id: '3',
        name: 'Gym T-Shirt',
        category: 'Apparel',
        price: 24.99,
        cost: 8.00,
        stock: 8,
        minStock: 20,
        sold: 89,
        revenue: 2224.11,
        isActive: true,
        description: 'Comfortable cotton gym t-shirt'
      },
      {
        id: '4',
        name: 'Water Bottle',
        category: 'Accessories',
        price: 19.99,
        cost: 5.00,
        stock: 67,
        minStock: 25,
        sold: 156,
        revenue: 3118.44,
        isActive: true,
        description: 'Insulated stainless steel water bottle'
      },
      {
        id: '5',
        name: 'Energy Drink',
        category: 'Beverages',
        price: 3.99,
        cost: 1.50,
        stock: 2,
        minStock: 50,
        sold: 234,
        revenue: 933.66,
        isActive: true,
        description: 'Natural energy drink with vitamins'
      },
      {
        id: '6',
        name: 'Protein Bar',
        category: 'Snacks',
        price: 4.99,
        cost: 2.00,
        stock: 89,
        minStock: 30,
        sold: 345,
        revenue: 1721.55,
        isActive: true,
        description: 'High protein snack bar'
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      sold: 0,
      revenue: 0,
      isActive: formData.isActive,
      description: formData.description
    };
    
    setProducts(prev => [product, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      isActive: formData.isActive,
      description: formData.description
    };
    
    setProducts(prev => prev.map(product => 
      product.id === editingProduct.id ? updatedProduct : product
    ));
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Supplements',
      price: '',
      cost: '',
      stock: '',
      minStock: '10',
      description: '',
      isActive: true
    });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      description: product.description,
      isActive: product.isActive
    });
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'out', color: 'text-red-400 bg-red-500/20', text: 'Out of Stock' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'text-yellow-400 bg-yellow-500/20', text: 'Low Stock' };
    return { status: 'good', color: 'text-green-400 bg-green-500/20', text: 'In Stock' };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: products.filter(p => p.stock <= p.minStock).length,
    totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Products & Inventory</h2>
          <p className="text-gray-400">Manage products and track inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inventory Value</p>
              <p className="text-2xl font-bold text-cyan-400">${stats.totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Product</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Category</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Price</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Stock</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Revenue</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">Sold: {product.sold}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="bg-gray-800 border border-purple-500/30 px-3 py-1 rounded-full text-purple-400 text-sm inline-block">
                        {product.category}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-bold">${product.price}</p>
                        <p className="text-gray-400 text-sm">Cost: ${product.cost}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{product.stock}</p>
                        <p className="text-gray-400 text-sm">Min: {product.minStock}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold">${product.revenue.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => startEdit(product)}
                          className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            
            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Stock</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Active Product</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Product Information</h4>
                    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <p className="text-gray-300"><span className="text-purple-400">Category:</span> {selectedProduct.category}</p>
                      <p className="text-gray-300"><span className="text-purple-400">Price:</span> ${selectedProduct.price}</p>
                      <p className="text-gray-300"><span className="text-purple-400">Cost:</span> ${selectedProduct.cost}</p>
                      <p className="text-gray-300"><span className="text-purple-400">Profit Margin:</span> {(((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Stock Information</h4>
                    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <p className="text-gray-300"><span className="text-cyan-400">Current Stock:</span> {selectedProduct.stock}</p>
                      <p className="text-gray-300"><span className="text-cyan-400">Minimum Stock:</span> {selectedProduct.minStock}</p>
                      <p className="text-gray-300"><span className="text-cyan-400">Stock Value:</span> ${(selectedProduct.stock * selectedProduct.price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Sales Performance</h4>
                    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <p className="text-gray-300"><span className="text-green-400">Units Sold:</span> {selectedProduct.sold}</p>
                      <p className="text-gray-300"><span className="text-green-400">Total Revenue:</span> ${selectedProduct.revenue.toLocaleString()}</p>
                      <p className="text-gray-300"><span className="text-green-400">Avg. Sale Price:</span> ${selectedProduct.sold > 0 ? (selectedProduct.revenue / selectedProduct.sold).toFixed(2) : '0.00'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Status</h4>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(selectedProduct.status)}`}>
                        {getStockStatus(selectedProduct).text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300">{selectedProduct.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsInventory;