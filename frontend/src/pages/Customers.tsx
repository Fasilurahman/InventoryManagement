import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  SortDesc,
  SortAsc,
  X,
  User,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  Loader2,
  Check,

} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { createCustomer, getCustomers } from "../services/CustomerService";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases?: number;
  lastPurchase?: string;
}

const customerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  address: z.string().max(120, "Address too long (max 120 characters)").optional()
});

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, _setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showLedger, setShowLedger] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Sample ledger data
  

  const filteredCustomers = customers
    .filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.includes(searchTerm) || // Phone numbers often have + and other characters
        customer.id?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        console.log("Fetched customers:", data.customers);
        setCustomers(data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast.error("Failed to load customers");
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = customerSchema.parse(formData);
      
      // Submit logic
      const newCustomer = await createCustomer(validatedData);
      console.log("New customer created:", newCustomer);
      toast.success("Customer created successfully!");
      
      // Update state and reset form
      setCustomers(prev => [...prev, newCustomer.customer]);
      setFormData({ name: "", email: "", phone: "", address: "" });
      setErrors({});
      setShowAddModal(false);

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors = error.flatten().fieldErrors;
        setErrors(Object.fromEntries(
          Object.entries(newErrors).map(([key, value]) => [key, value?.[0] ?? ""])
        ));
      } else {
        console.error("Error creating customer:", error);
        toast.error(error.message || "Failed to create customer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Customer Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-lg hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <Plus size={20} className="animate-pulse" />
          Add New Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100/80">
              <tr>
                {["id", "name", "email", "phone"].map(
                  (field) => (
                    <th
                      key={field}
                      className={`px-6 py-4 text-left text-xs font-semibold text-slate-600/90 uppercase tracking-wider ${
                        field === "email"
                          ? "hidden md:table-cell"
                          : field === "phone"
                          ? "hidden lg:table-cell"
                          : field === "lastPurchase"
                          ? "hidden xl:table-cell"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() => handleSort(field as keyof Customer)}
                        className="flex items-center gap-1.5 group hover:text-indigo-600/90 transition-colors"
                      >
                        <span className="transform transition-transform group-hover:scale-105">
                          {field === "lastPurchase" ? "Last Purchase" : field}
                        </span>
                        <div className="flex flex-col">
                          <SortAsc
                            size={12}
                            className={`mb-[-3px] ${
                              sortField === field && sortDirection === "asc"
                                ? "text-indigo-500/90"
                                : "text-slate-300/90 group-hover:text-indigo-300/90"
                            }`}
                          />
                          <SortDesc
                            size={12}
                            className={`mt-[-3px] ${
                              sortField === field && sortDirection === "desc"
                                ? "text-indigo-500/90"
                                : "text-slate-300/90 group-hover:text-indigo-300/90"
                            }`}
                          />
                        </div>
                      </button>
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/80">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  {/* Table cells remain the same as before but with enhanced styling */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900/90">
                    <span className="bg-indigo-50/50 text-indigo-600/90 px-2.5 py-1 rounded-lg text-xs">
                      #{customer.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900/90">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600/90 hidden md:table-cell">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600/90 hidden lg:table-cell">
                    {customer.phone}
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400/90">
                      <Search className="w-8 h-8" />
                      <p className="font-medium">
                        No customers found matching "{searchTerm}"
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-indigo-500/90 hover:text-indigo-600/90 text-sm font-medium mt-2"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-pink-500/20 animate-gradient-rotate"
          onClick={() => setShowAddModal(false)}
        />

        {/* Modal Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl z-10 w-full max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 border-b border-white/20">
            {/* ... existing header content ... */}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gradient-to-b from-white to-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <User className="w-4 h-4 mr-2 text-slate-500" />
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Johnathan Doe"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-300' : 'border-slate-200'
                    } focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder-slate-400 transition-all pr-10`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-300' : 'border-slate-200'
                    } focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder-slate-400 transition-all pr-10`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" />
                  Phone Number
                  <span className="text-slate-400 ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? 'border-red-300' : 'border-slate-200'
                    } focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder-slate-400 transition-all pl-14`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-2 col-span-full">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                  Shipping Address
                </label>
                <textarea
                  placeholder="123 Main St, City, Country"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address ? 'border-red-300' : 'border-slate-200'
                  } focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder-slate-400 h-32 resize-none transition-all`}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>We'll never share this information</span>
                  <span>{formData.address.length}/120</span>
                </div>
                {errors.address && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.address}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAddModal(false)}
          className="px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 font-medium transition-all duration-200 hover:shadow-sm flex items-center"
        >
          <X className="w-5 h-5 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          <span className="relative z-10 flex items-center">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2 text-white/90" />
                Save Customer
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-300/20 rounded-full blur-3xl animate-float-delayed" />
        </div>
      </div>
    )}

      {/* Customer Ledger Modal */}
      {showLedger && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShowLedger(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-xl z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                Customer Ledger
              </h3>
              <button
                onClick={() => setShowLedger(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">
                        Customer Name
                      </h4>
                      <p className="text-slate-800 font-medium">
                        {selectedCustomer.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">
                        Email
                      </h4>
                      <p className="text-slate-800">{selectedCustomer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">
                        Phone
                      </h4>
                      <p className="text-slate-800">{selectedCustomer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start md:col-span-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">
                        Address
                      </h4>
                      <p className="text-slate-800">
                        {selectedCustomer.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowLedger(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
