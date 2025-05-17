import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";

// import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route index element={<DashboardPage />} /> */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          {/* <Route path="sales" element={<Sales />} /> */}
          {/* <Route path="reports" element={<Reports />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
