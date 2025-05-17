import React, { useState } from 'react';
import { 
  Package, ShoppingCart, DollarSign, Users, TrendingUp,
  TrendingDown, Calendar, Clock, BarChart, PieChart, ArrowRight 
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState('week');
  
  // Sample data for demonstration
  const summaryData = {
    totalSales: { value: 24560, change: 12.5, isPositive: true },
    totalItems: { value: 458, change: 8.3, isPositive: true },
    lowStock: { value: 12, change: -4.2, isPositive: false },
    customers: { value: 186, change: 5.8, isPositive: true },
  };
  
  const recentSales = [
    { id: 'S001', customer: 'John Smith', date: '2025-04-08', amount: 1250.99, status: 'Completed' },
    { id: 'S002', customer: 'Emma Johnson', date: '2025-04-08', amount: 899.50, status: 'Completed' },
    { id: 'S003', customer: 'Michael Brown', date: '2025-04-07', amount: 350.00, status: 'Pending' },
    { id: 'S004', customer: 'Lisa Davis', date: '2025-04-07', amount: 1899.99, status: 'Completed' },
    { id: 'S005', customer: 'Robert Wilson', date: '2025-04-06', amount: 475.50, status: 'Cancelled' },
  ];
  
  const lowStockItems = [
    { id: 'I001', name: 'Wireless Mouse', current: 8, minimum: 10 },
    { id: 'I002', name: 'USB-C Cable', current: 5, minimum: 15 },
    { id: 'I003', name: 'Mechanical Keyboard', current: 3, minimum: 5 },
    { id: 'I004', name: 'HDMI Adapter', current: 7, minimum: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Dashboard Overview</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              period === 'week' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              period === 'month' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              period === 'year' 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Sales */}
        <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sales</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">${summaryData.totalSales.value.toLocaleString()}</h3>
              <div className="mt-2 flex items-center">
                {summaryData.totalSales.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  summaryData.totalSales.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {summaryData.totalSales.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-indigo-100 text-indigo-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Items */}
        <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Items</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{summaryData.totalItems.value}</h3>
              <div className="mt-2 flex items-center">
                {summaryData.totalItems.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  summaryData.totalItems.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {summaryData.totalItems.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-purple-100 text-purple-600">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Low Stock */}
        <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{summaryData.lowStock.value}</h3>
              <div className="mt-2 flex items-center">
                {summaryData.lowStock.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  summaryData.lowStock.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {summaryData.lowStock.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-amber-100 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Total Customers */}
        <div className="card dashboard-card p-6 transition-transform duration-300 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Customers</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{summaryData.customers.value}</h3>
              <div className="mt-2 flex items-center">
                {summaryData.customers.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  summaryData.customers.isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {summaryData.customers.change}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last {period}</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-emerald-100 text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="card lg:col-span-2">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Sales Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                <span className="text-xs text-slate-500">Sales</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
            </div>
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
        
        {/* Low Stock Items */}
        <div className="card">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Low Stock Items</h3>
            <a href="#" className="text-xs text-purple-600 hover:text-purple-800 flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Item #{item.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">{item.current}/{item.minimum}</p>
                      <p className="text-xs text-slate-500">In Stock</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-red-500 h-1.5 rounded-full" 
                      style={{ width: `${(item.current / item.minimum) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Sales */}
      <div className="card">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Recent Sales</h3>
          <a href="#" className="text-xs text-purple-600 hover:text-purple-800 flex items-center">
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-slate-800">#{sale.id}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{sale.customer}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{sale.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                    ${sale.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      sale.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="text-purple-600 hover:text-purple-900 font-medium text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;