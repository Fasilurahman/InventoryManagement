import React, { useState } from 'react';
import { 
  Calendar, BarChart2, PieChart, Users, Download, Printer, Mail, 
  FileText, BarChart, DollarSign, TrendingUp, TrendingDown, ShoppingBag,
  ArrowDownRight, ArrowUpRight
} from 'lucide-react';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [period, setPeriod] = useState('month');
  
  const exportReport = (format: string) => {
    console.log(`Exporting ${activeTab} report in ${format} format`);
    // Implementation would go here
  };
  
  // Sample data
  const salesData = {
    totals: {
      sales: { value: 45680.75, change: 12.5, isPositive: true },
      orders: { value: 154, change: 8.3, isPositive: true },
      avgOrder: { value: 296.63, change: 4.2, isPositive: true },
      customers: { value: 68, change: 15.8, isPositive: true },
    },
    topProducts: [
      { name: 'Wireless Mouse', sales: 32, revenue: 959.68 },
      { name: 'USB-C Cable', sales: 56, revenue: 727.44 },
      { name: 'Office Chair', sales: 18, revenue: 3419.82 },
      { name: 'Wireless Keyboard', sales: 24, revenue: 1919.76 },
      { name: 'Monitor Stand', sales: 29, revenue: 1333.71 },
    ],
    topCustomers: [
      { name: 'John Smith', orders: 5, spent: 3150.45 },
      { name: 'Emma Johnson', orders: 4, spent: 2450.99 },
      { name: 'Michael Brown', orders: 3, spent: 1950.50 },
      { name: 'Lisa Davis', orders: 3, spent: 1875.25 },
      { name: 'Robert Wilson', orders: 2, spent: 1250.99 },
    ],
  };
  
  const renderSalesReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sales</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">${salesData.totals.sales.value.toLocaleString()}</h3>
              <div className="mt-2 flex items-center">
                {salesData.totals.sales.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  salesData.totals.sales.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {salesData.totals.sales.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-indigo-100 text-indigo-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Orders</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{salesData.totals.orders.value}</h3>
              <div className="mt-2 flex items-center">
                {salesData.totals.orders.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  salesData.totals.orders.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {salesData.totals.orders.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-purple-100 text-purple-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Order Value</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">${salesData.totals.avgOrder.value.toFixed(2)}</h3>
              <div className="mt-2 flex items-center">
                {salesData.totals.avgOrder.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  salesData.totals.avgOrder.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {salesData.totals.avgOrder.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-emerald-100 text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Unique Customers</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{salesData.totals.customers.value}</h3>
              <div className="mt-2 flex items-center">
                {salesData.totals.customers.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  salesData.totals.customers.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {salesData.totals.customers.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Sales Over Time</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
              <div className="text-center">
                <BarChart className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-slate-500 mt-2">Sales chart visualization</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Sales by Category</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-slate-500 mt-2">Category distribution visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Products & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Units Sold</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {salesData.topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-slate-600">
                      {product.sales}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right text-slate-800">
                      ${product.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Top Customers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {salesData.topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                      {customer.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-slate-600">
                      {customer.orders}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right text-slate-800">
                      ${customer.spent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderInventoryReport = () => (
    <div className="p-6 text-center">
      <BarChart2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Inventory Report</h3>
      <p className="text-slate-500">Detailed inventory analysis with stock levels, turnover rates, and valuation.</p>
    </div>
  );
  
  const renderCustomerReport = () => (
    <div className="p-6 text-center">
      <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Customer Report</h3>
      <p className="text-slate-500">Comprehensive customer analysis with purchase history, lifetime value, and retention metrics.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => exportReport('print')}
            className="btn btn-secondary"
          >
            <Printer size={18} className="mr-1" />
            Print
          </button>
          <button 
            onClick={() => exportReport('excel')}
            className="btn btn-secondary"
          >
            <Download size={18} className="mr-1" />
            Excel
          </button>
          <button 
            onClick={() => exportReport('pdf')}
            className="btn btn-secondary"
          >
            <FileText size={18} className="mr-1" />
            PDF
          </button>
          <button 
            onClick={() => exportReport('email')}
            className="btn btn-secondary"
          >
            <Mail size={18} className="mr-1" />
            Email
          </button>
        </div>
      </div>
      
      {/* Tabs and Period Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="flex overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 text-sm rounded-lg mr-2 whitespace-nowrap ${
              activeTab === 'sales' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sales Report
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm rounded-lg mr-2 whitespace-nowrap ${
              activeTab === 'inventory' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Inventory Report
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap ${
              activeTab === 'customers' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Customer Report
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${
              period === 'week' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            This Week
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${
              period === 'month' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            This Month
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${
              period === 'year' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            This Year
          </button>
          <button 
            onClick={() => setPeriod('custom')}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${
              period === 'custom' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Custom
          </button>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'sales' && renderSalesReport()}
        {activeTab === 'inventory' && renderInventoryReport()}
        {activeTab === 'customers' && renderCustomerReport()}
      </div>
    </div>
  );
};

export default Reports;