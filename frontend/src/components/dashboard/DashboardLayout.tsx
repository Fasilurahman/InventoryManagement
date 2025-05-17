import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Layers, Home, Package, Users, ShoppingCart, 
  BarChart2, LogOut, Menu, X, Bell, Search,
  ChevronDown
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const notifications = [
    { id: 1, message: 'Inventory low: Wireless Mouse', time: '2 hours ago', isNew: true },
    { id: 2, message: 'New sale: #1023 completed', time: '5 hours ago', isNew: true },
    { id: 3, message: 'Customer profile updated: John Doe', time: 'Yesterday', isNew: false },
  ];
  
  const navLinks = [
    // { to: '', icon: <Home size={20} />, label: 'Dashboard' },
    { to: 'inventory', icon: <Package size={20} />, label: 'Inventory' },
    { to: 'customers', icon: <Users size={20} />, label: 'Customers' },
    // { to: 'sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
    // { to: 'reports', icon: <BarChart2 size={20} />, label: 'Reports' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const getPageTitle = () => {
    const segments = location.pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment === 'dashboard' 
      ? 'Dashboard' 
      : lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">InventPro</span>
          </div>
          <button 
            className="p-1 text-slate-500 rounded-md hover:bg-slate-100 lg:hidden"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-purple-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button 
              className="p-1 mr-4 text-slate-500 rounded-md hover:bg-slate-100 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 py-2 pl-10 pr-4 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 text-slate-500 rounded-full hover:bg-slate-100"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-2 px-4 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 border-b border-slate-100 last:border-0 ${notification.isNew ? 'bg-purple-50' : ''}`}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-slate-800">{notification.message}</p>
                          {notification.isNew && (
                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">New</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 px-4 border-t border-slate-200">
                    <button className="text-sm text-purple-600 hover:text-purple-800">View all notifications</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <span className="hidden text-sm font-medium text-slate-700 md:block">John Doe</span>
                <ChevronDown size={16} className="hidden text-slate-400 md:block" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Profile</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</button>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gradient-subtle">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;