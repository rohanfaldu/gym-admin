import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Send,
  Calendar,
  User,
  Package,
  CreditCard,
  TrendingUp,
  FileText
} from 'lucide-react';

interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  type: 'membership' | 'product' | 'service';
}

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const SalesInvoicing: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    // Mock data for demo
    setSales([
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          { id: '1', name: 'Premium Membership', quantity: 1, price: 59.99, total: 59.99 }
        ],
        subtotal: 59.99,
        tax: 5.40,
        total: 65.39,
        paymentMethod: 'Credit Card',
        status: 'paid',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'membership'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        items: [
          { id: '1', name: 'Whey Protein Powder', quantity: 2, price: 49.99, total: 99.98 },
          { id: '2', name: 'Water Bottle', quantity: 1, price: 19.99, total: 19.99 }
        ],
        subtotal: 119.97,
        tax: 10.80,
        total: 130.77,
        paymentMethod: 'Cash',
        status: 'paid',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'product'
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        items: [
          { id: '1', name: 'Personal Training Session', quantity: 4, price: 75.00, total: 300.00 }
        ],
        subtotal: 300.00,
        tax: 27.00,
        total: 327.00,
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'service'
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        customerName: 'Emma Davis',
        customerEmail: 'emma@example.com',
        items: [
          { id: '1', name: 'Basic Membership', quantity: 1, price: 29.99, total: 29.99 }
        ],
        subtotal: 29.99,
        tax: 2.70,
        total: 32.69,
        paymentMethod: 'Credit Card',
        status: 'overdue',
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'membership'
      }
    ]);
    setLoading(false);
  }, []);

  const handleDownloadInvoice = (sale: Sale) => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob([`Invoice ${sale.invoiceNumber} for ${sale.customerName}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${sale.invoiceNumber}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendInvoice = (sale: Sale) => {
    alert(`Invoice ${sale.invoiceNumber} sent to ${sale.customerEmail}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Calendar className="h-4 w-4 text-yellow-400" />;
      case 'overdue':
        return <Calendar className="h-4 w-4 text-red-400" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'overdue':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'membership':
        return <User className="h-4 w-4 text-purple-400" />;
      case 'product':
        return <Package className="h-4 w-4 text-cyan-400" />;
      case 'service':
        return <CreditCard className="h-4 w-4 text-pink-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || sale.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const saleDate = new Date(sale.date);
      const now = new Date();
      switch (dateRange) {
        case 'today':
          matchesDate = saleDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = saleDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = saleDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const stats = {
    totalSales: sales.reduce((sum, s) => sum + s.total, 0),
    paidAmount: sales.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total, 0),
    pendingAmount: sales.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.total, 0),
    overdueAmount: sales.filter(s => s.status === 'overdue').reduce((sum, s) => sum + s.total, 0)
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
          <h2 className="text-2xl font-bold text-white">Sales & Invoicing</h2>
          <p className="text-gray-400">Manage sales transactions and invoices</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-white">${stats.totalSales.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Paid</p>
              <p className="text-2xl font-bold text-green-400">${stats.paidAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">${stats.pendingAmount.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-400">${stats.overdueAmount.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          <option value="membership">Membership</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Sales Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Invoice</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Type</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <span className="text-white font-medium">{sale.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">{sale.customerName}</p>
                      <p className="text-gray-400 text-sm">{sale.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(sale.type)}
                      <span className="text-gray-300 capitalize">{sale.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-bold">${sale.total.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">{sale.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
                      {getStatusIcon(sale.status)}
                      <span className="capitalize">{sale.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-300">
                      <p>{new Date(sale.date).toLocaleDateString()}</p>
                      <p className="text-sm">Due: {new Date(sale.dueDate).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSale(sale);
                          setShowInvoiceModal(true);
                        }}
                        className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200"
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(sale)}
                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendInvoice(sale)}
                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                        title="Send Invoice"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {showInvoiceModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Invoice Details</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Invoice Information</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300"><span className="text-purple-400">Invoice #:</span> {selectedSale.invoiceNumber}</p>
                    <p className="text-gray-300"><span className="text-purple-400">Date:</span> {new Date(selectedSale.date).toLocaleDateString()}</p>
                    <p className="text-gray-300"><span className="text-purple-400">Due Date:</span> {new Date(selectedSale.dueDate).toLocaleDateString()}</p>
                    <p className="text-gray-300"><span className="text-purple-400">Payment Method:</span> {selectedSale.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Customer Information</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300"><span className="text-cyan-400">Name:</span> {selectedSale.customerName}</p>
                    <p className="text-gray-300"><span className="text-cyan-400">Email:</span> {selectedSale.customerEmail}</p>
                    <p className="text-gray-300"><span className="text-cyan-400">Type:</span> {selectedSale.type}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-4">Items</h4>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-gray-300">Item</th>
                        <th className="text-left py-3 px-4 text-gray-300">Quantity</th>
                        <th className="text-left py-3 px-4 text-gray-300">Price</th>
                        <th className="text-left py-3 px-4 text-gray-300">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {selectedSale.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 px-4 text-white">{item.name}</td>
                          <td className="py-3 px-4 text-gray-300">{item.quantity}</td>
                          <td className="py-3 px-4 text-gray-300">${item.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-white font-medium">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax:</span>
                    <span>${selectedSale.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total:</span>
                      <span>${selectedSale.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => handleDownloadInvoice(selectedSale)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handleSendInvoice(selectedSale)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoicing;