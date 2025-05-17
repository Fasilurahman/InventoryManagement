import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FileSpreadsheet, File as FilePdf, Printer, Mail, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    quantity: 45,
    price: 199.99,
    category: 'Electronics',
    lastUpdated: '2024-03-15'
  },
  // Add more mock items...
];

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});

  const handleExport = (type: 'excel' | 'pdf' | 'print' | 'email') => {
    toast.success(`Exported as ${type.toUpperCase()}`);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Item
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
            placeholder="Search items by name or description..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.quantity <= 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => {/* Handle edit */}}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {/* Handle delete */}}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Item</h2>
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
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Item name"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  rows={3}
                  placeholder="Item description"
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="0"
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="0.00"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={newItem.category || ''}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;