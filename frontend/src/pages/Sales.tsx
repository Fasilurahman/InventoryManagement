import React, { useState } from 'react';
import { 
  Search, Plus, Filter, X, Trash2, Calendar, 
  CheckCircle, Users, DollarSign, ShoppingBag, CreditCard,
  ArrowRight, Save
} from 'lucide-react';

interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSaleForm, setShowNewSaleForm] = useState(false);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [showItemSearch, setShowItemSearch] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Sample data
  const recentSales = [
    { id: 'S001', customer: 'John Smith', date: '2025-04-08', items: 3, total: 1250.99, status: 'Completed' },
    { id: 'S002', customer: 'Emma Johnson', date: '2025-04-08', items: 2, total: 899.50, status: 'Completed' },
    { id: 'S003', customer: 'Michael Brown', date: '2025-04-07', items: 1, total: 350.00, status: 'Pending' },
    { id: 'S004', customer: 'Lisa Davis', date: '2025-04-07', items: 4, total: 1899.99, status: 'Completed' },
    { id: 'S005', customer: 'Robert Wilson', date: '2025-04-06', items: 2, total: 475.50, status: 'Cancelled' },
    { id: 'S006', customer: 'Cash Sale', date: '2025-04-06', items: 1, total: 45.99, status: 'Completed' },
    { id: 'S007', customer: 'Susan Miller', date: '2025-04-05', items: 3, total: 780.25, status: 'Completed' },
    { id: 'S008', customer: 'David Clark', date: '2025-04-05', items: 2, total: 125.50, status: 'Completed' },
  ];
  
  const customers: Customer[] = [
    { id: 'C001', name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567' },
    { id: 'C002', name: 'Emma Johnson', email: 'emma.j@example.com', phone: '(555) 987-6543' },
    { id: 'C003', name: 'Michael Brown', email: 'michael.b@example.com', phone: '(555) 234-5678' },
    { id: 'C004', name: 'Lisa Davis', email: 'lisa.d@example.com', phone: '(555) 876-5432' },
    { id: 'C005', name: 'Robert Wilson', email: 'robert.w@example.com', phone: '(555) 345-6789' },
  ];
  
  const inventoryItems = [
    { id: 'INV001', name: 'Wireless Mouse', price: 29.99, quantity: 45 },
    { id: 'INV002', name: 'USB-C Cable', price: 12.99, quantity: 5 },
    { id: 'INV003', name: 'Office Chair', price: 189.99, quantity: 12 },
    { id: 'INV004', name: 'Desk Lamp', price: 34.99, quantity: 0 },
    { id: 'INV005', name: 'Notebook Set', price: 15.99, quantity: 78 },
    { id: 'INV006', name: 'Wireless Keyboard', price: 79.99, quantity: 23 },
    { id: 'INV007', name: 'Monitor Stand', price: 45.99, quantity: 8 },
  ];
  
  // Filter customers
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm)
  );
  
  // Filter inventory items
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );
  
  // Filter sales
  const filteredSales = recentSales.filter(sale => 
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.date.includes(searchTerm)
  );
  
  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
  };
  
  const addItemToSale = (item: { id: string; name: string; price: number; quantity: number }) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          total: item.price
        }
      ]);
    }
    
    setShowItemSearch(false);
  };
  
  const removeItemFromSale = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };
  
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return;
    
    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          total: quantity * item.price
        };
      }
      return item;
    });
    
    setSelectedItems(updatedItems);
  };
  
  const getTotalAmount = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };
  
  const handleSaveSale = () => {
    // In a real application, this would send data to the server
    console.log({
      date: saleDate,
      customer: selectedCustomer || 'Cash Sale',
      items: selectedItems,
      total: getTotalAmount(),
      paymentMethod
    });
    
    // Reset form
    setShowNewSaleForm(false);
    setSelectedCustomer(null);
    setSelectedItems([]);
    setSaleDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
  };

  return (
    <div className="space-y-6">
      {showNewSaleForm ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Record New Sale</h1>
            <button 
              onClick={() => setShowNewSaleForm(false)}
              className="btn btn-secondary"
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sale Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Sale Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label htmlFor="saleDate" className="form-label">Sale Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        id="saleDate"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                        className="form-input pl-10"
                      />
                      <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-input"
                    >
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Customer</label>
                  {selectedCustomer ? (
                    <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium mr-3">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{selectedCustomer.name}</p>
                          <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedCustomer(null)}
                        className="p-1 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          placeholder="Search for a customer..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          onFocus={() => setShowCustomerSearch(true)}
                          className="form-input pl-10 py-2"
                        />
                        <Users className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        
                        {showCustomerSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
                            {filteredCustomers.length > 0 ? (
                              filteredCustomers.map(customer => (
                                <div 
                                  key={customer.id}
                                  onClick={() => selectCustomer(customer)}
                                  className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                >
                                  <p className="font-medium text-slate-800">{customer.name}</p>
                                  <p className="text-xs text-slate-500">{customer.email} • {customer.phone}</p>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-slate-500">
                                No customers found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setShowNewSaleForm(false)}
                        className="btn btn-secondary"
                      >
                        <Plus size={18} className="mr-1" />
                        New
                      </button>
                    </div>
                  )}
                  
                  {!selectedCustomer && (
                    <div className="mt-2">
                      <button 
                        onClick={() => setSelectedCustomer({ id: 'cash', name: 'Cash Sale', email: '', phone: '' })}
                        className="text-sm text-purple-600 hover:text-purple-800"
                      >
                        Continue with Cash Sale
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Items</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for items..."
                      value={itemSearchTerm}
                      onChange={(e) => setItemSearchTerm(e.target.value)}
                      onFocus={() => setShowItemSearch(true)}
                      className="form-input pl-10 py-2 text-sm w-64"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    
                    {showItemSearch && (
                      <div className="absolute z-10 right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => item.quantity > 0 ? addItemToSale(item) : null}
                              className={`p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 ${
                                item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium text-slate-800">{item.name}</p>
                                  <p className="text-xs text-slate-500">#{item.id}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-slate-800">${item.price.toFixed(2)}</p>
                                  <p className="text-xs text-slate-500">
                                    {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-slate-500">
                            No items found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedItems.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <button 
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10))}
                                  className="w-12 h-8 mx-1 border border-slate-200 rounded text-center text-sm"
                                  min="1"
                                />
                                <button 
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right text-slate-800">
                              ${item.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              <button 
                                onClick={() => removeItemFromSale(item.id)}
                                className="p-1 text-slate-600 hover:text-red-600 rounded-full hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">No items added to this sale</p>
                    <p className="text-sm text-slate-400">Search and select items from the inventory</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sale Summary */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Sale Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-800">${getTotalAmount().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (0%)</span>
                    <span className="font-medium text-slate-800">$0.00</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-slate-800">Total</span>
                    <span className="text-lg font-bold text-purple-600">${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={handleSaveSale}
                    disabled={selectedItems.length === 0}
                    className={`btn btn-primary w-full ${
                      selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Complete Sale
                  </button>
                  
                  <button className="btn btn-secondary w-full">
                    <Save size={18} className="mr-1" />
                    Save as Draft
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <CreditCard size={16} />
                  </div>
                  <h3 className="font-medium text-slate-800">Payment Method</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      checked={paymentMethod === 'cash'} 
                      onChange={() => setPaymentMethod('cash')}
                      className="mr-3"
                    />
                    <span>Cash</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="credit_card" 
                      checked={paymentMethod === 'credit_card'} 
                      onChange={() => setPaymentMethod('credit_card')} 
                      className="mr-3"
                    />
                    <span>Credit Card</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank_transfer" 
                      checked={paymentMethod === 'bank_transfer'} 
                      onChange={() => setPaymentMethod('bank_transfer')} 
                      className="mr-3"
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800">Sales Management</h1>
            <button 
              onClick={() => setShowNewSaleForm(true)}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-1" />
              Record New Sale
            </button>
          </div>
          
          {/* Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by customer, ID, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 py-2"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              </div>
              
              <div className="flex gap-2">
                <div className="dropdown relative">
                  <button className="btn btn-secondary">
                    <Filter size={18} className="mr-1" />
                    Filter
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Today's Sales</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">$2,150.49</h3>
                  <p className="mt-2 text-xs text-slate-500">From 8 orders</p>
                </div>
                <div className="rounded-full p-3 bg-indigo-100 text-indigo-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">This Week</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">$12,650.75</h3>
                  <p className="mt-2 text-xs text-slate-500">From 42 orders</p>
                </div>
                <div className="rounded-full p-3 bg-purple-100 text-purple-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Items Sold</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">156</h3>
                  <p className="mt-2 text-xs text-slate-500">This month</p>
                </div>
                <div className="rounded-full p-3 bg-amber-100 text-amber-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Avg. Order Value</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800">$301.20</h3>
                  <p className="mt-2 text-xs text-slate-500">This month</p>
                </div>
                <div className="rounded-full p-3 bg-emerald-100 text-emerald-600">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Recent Sales</h2>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                        #{sale.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                        {sale.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                        {sale.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-slate-600">
                        {sale.items}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right text-slate-800">
                        ${sale.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`badge ${
                          sale.status === 'Completed' ? 'badge-success' :
                          sale.status === 'Pending' ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button className="text-purple-600 hover:text-purple-900 font-medium text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredSales.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        No sales found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;