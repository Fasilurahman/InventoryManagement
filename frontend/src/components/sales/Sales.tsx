import React, { useState } from 'react';
import { Plus, Search, Calendar, User, DollarSign, Package, X, FileSpreadsheet, File as FilePdf, Printer, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface Sale {
  id: string;
  date: string;
  customer: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentType: 'cash' | 'card';
}

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2024-03-15',
    customer: 'John Doe',
    items: [
      { id: '1', name: 'Wireless Headphones', quantity: 1, price: 199.99 }
    ],
    total: 199.99,
    paymentType: 'card'
  },
  // Add more mock sales...
];

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSale, setNewSale] = useState<Partial<Sale>>({});

  const handleExport = (type: 'excel' | 'pdf' | 'print' | 'email') => {
    toast.success(`Exported as ${type.toUpperCase()}`);
  };

  const filteredSales = sales.filter(sale => 
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Record Sale
          </button>
          <div className="flex gap-2 border-l pl-2 ml-2">
            <button
              onClick={() => handleExport('excel')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export to Excel"
            >
              <FileSpreadsheet className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export to PDF"
            >
              <FilePdf className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleExport('print')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleExport('email')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Email"
            >
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sales by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">{sale.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {sale.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${sale.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.paymentType === 'card' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.paymentType.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Record New Sale</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Items
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <option value="">Select item</option>
                      <option value="1">Wireless Headphones</option>
                      <option value="2">Smartphone</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                      type="button"
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;