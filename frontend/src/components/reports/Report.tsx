import React, { useState } from 'react';
import { FileSpreadsheet, File as FilePdf, Printer, Mail, Calendar, ChevronDown, BarChart, LineChart, PieChart } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'items' | 'customers'>('sales');
  const [dateRange, setDateRange] = useState('week');

  const handleExport = (type: 'excel' | 'pdf' | 'print' | 'email') => {
    toast.success(`Exported as ${type.toUpperCase()}`);
  };

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const itemsData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Other'],
    datasets: [
      {
        data: [300, 200, 150, 100],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
      },
    ],
  };

  const customerData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Customers',
        data: [20, 35, 25, 45, 30, 55],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border-none focus:ring-0"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2">
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sales'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LineChart className="h-5 w-5" />
            Sales Report
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'items'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <PieChart className="h-5 w-5" />
            Items Report
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'customers'
                ? 'bg-indigo-50 text-indigo-600'
                :   'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart className="h-5 w-5" />
            Customer Report
          </button>
        </div>

        <div className="h-[400px]">
          {activeTab === 'sales' && <Line data={salesData} />}
          {activeTab === 'items' && <Pie data={itemsData} />}
          {activeTab === 'customers' && <Bar data={customerData} />}
        </div>

        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTab === 'sales' && (
              <>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium">Total Sales</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">$12,345</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Average Daily Sales</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">$1,764</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Growth</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">+15.3%</p>
                </div>
              </>
            )}
            {activeTab === 'items' && (
              <>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">750</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Low Stock Items</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">23</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Categories</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">4</p>
                </div>
              </>
            )}
            {activeTab === 'customers' && (
              <>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">1,234</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">New Customers</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">45</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Retention Rate</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">87%</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Ledger</h3>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Customer {i}</div>
                    <div className="text-sm text-gray-500">customer{i}@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(Math.random() * 20) + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(Math.random() * 1000).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;