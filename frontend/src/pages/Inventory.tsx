import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  SortDesc,
  SortAsc,
  Edit,
  Trash2,
  Download,
  Printer,
  Mail,
  FileText,
  X,
  Save,
  AlertTriangle,
  Check,
  Eye,
  Image,
  AlignLeft,
  Hash,
  DollarSign,
  ChevronDown,
  List,
  Tag,
  Package,
  User,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Combobox } from "@headlessui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getCustomers } from "../services/CustomerService";
import { toast } from "sonner";
import { z } from "zod";
import {
  addInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  updateInventoryItem,
} from "../services/InventoryService";
import api from "../utils/axiosInstance";

interface InventoryItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
  purchasedBy: string[];
}


interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases?: number;
  lastPurchase?: string;
}

const categories = [
  "All",
  "Electronics",
  "Office Supplies",
  "Furniture",
  "Accessories",
];

const inventoryItemSchema = z.object({
  itemName: z
    .string()
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name cannot exceed 100 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .refine((val) => categories.filter((c: any) => c !== "All").includes(val), {
      message: "Invalid category selected",
    }),
  price: z
    .number()
    .min(0, "Price must be a non-negative number")
    .refine((val) => val >= 0, "Price cannot be negative"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity must be a non-negative integer"),
  description: z
    .string()
    .min(5, "Description cannot lessthan 5 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  purchasedBy: z.array(z.string()).optional(),
});

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortField, setSortField] = useState<keyof InventoryItem>("itemName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  //   const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [_loading, setLoading] = useState(false);

  const [editItemName, setEditItemName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editQuantity, setEditQuantity] = useState<number | "">("");
  const [editDescription, setEditDescription] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);



  function resetForm() {
    setItemName("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setDescription("");
    setSelectedCustomers([]);
    setCustomerQuery("");
  }

  const filteredItems = inventoryItems
    .filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const searchLower = searchTerm.toLowerCase();
      const customerNames = item?.purchasedBy.flatMap((customerStr: any) => {
        try {
          const customer: Customer = JSON.parse(customerStr);
          return customer.name.toLowerCase();
        } catch {
          return [];
        }
      });

      const matchesSearch =
        item.itemName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower) ||
        customerNames.some((name: any) => name.includes(searchLower));

      return matchesCategory && matchesSearch;
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

  // Sort handler
  const handleSort = (field: keyof InventoryItem) => {
    setSortField(field);
    setSortDirection((prev) =>
      field === sortField ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await getInventoryItems();
      console.log("Fetched inventory:", response.data);
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openItemDetails = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  const confirmDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const exportData = async (type: "print" | "excel" | "pdf" | "email") => {
    try {
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";
      const res = await api.get(`/report/sales`, {
        params: { startDate, endDate },
      });

      const report = res.data.report;

      const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        return new Date(dateStr).toLocaleString(undefined, options);
      };

      if (type === "print") {
        window.print();
      } else if (type === "excel") {
        const excelData = report.customers.map((customer: any) => ({
          CustomerID: customer.customerId,
          Name: customer.customerName,
          ItemsPurchased: customer.itemsPurchased,
          TotalSpent: customer.totalSpent,
          PurchaseDates: customer.purchaseDates.map(formatDate).join(", "),
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SalesReport");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `sales-report-${Date.now()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Sales Report", 14, 15);

        autoTable(doc, {
          startY: 25,
          head: [
            [
              "Customer ID",
              "Name",
              "Items Purchased",
              "Total Spent",
              "Purchase Dates",
            ],
          ],
          body: report.customers.map((customer: any) => [
            customer.customerId,
            customer.customerName,
            customer.itemsPurchased,
            customer.totalSpent,
            customer.purchaseDates.map(formatDate).join(", "),
          ]),
        });

        doc.save(`sales-report-${Date.now()}.pdf`);
      }

      if (type === "email") {
        console.log("Sending email with report:", report);
        const toEmail = "fasilu707@gmail.com";
        await api.post("/report/send-email", {
          toEmail,
          report,
        });

        toast.success("Email sent successfully!");
      }
    } catch (error) {
      console.error("Report export failed:", error);
      alert("Failed to generate report");
    }
  };

  const exportItemReport = async (
    type: "print" | "excel" | "pdf" | "email"
  ) => {
    try {
      console.log("Exporting item report...");

      const res = await api.get("/report/items");
      console.log("Item report response:", res.data);
      const report = res.data.report;

      const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        return new Date(dateStr).toLocaleString(undefined, options);
      };

      if (type === "print") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Item Report</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                  th { background-color: #f5f5f5; }
                </style>
              </head>
              <body>
                <h2>Item Report</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Added Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${report.items
                      .map(
                        (item: any) => `
                      <tr>
                        <td>${item.itemId}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${formatDate(item.createdAt)}</td>
                      </tr>`
                      )
                      .join("")}
                  </tbody>
                </table>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      } else if (type === "excel") {
        const excelData = report.items.map((item: any) => ({
          ItemID: item.id,
          Name: item.name,
          Quantity: item.quantity,
          Price: item.price,
          AddedDate: formatDate(item.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ItemReport");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `item-report-${Date.now()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Item Report", 14, 15);

        autoTable(doc, {
          startY: 25,
          head: [["Item ID", "Name", "Quantity", "Price", "Added Date"]],
          body: report.items.map((item: any) => [
            item.id,
            item.name,
            item.quantity,
            item.price,
            formatDate(item.createdAt),
          ]),
        });

        doc.save(`item-report-${Date.now()}.pdf`);
      }

      if (type === "email") {
        console.log("Sending item report email...");
        const toEmail = "fasilu707@gmail.com";
        await api.post("/report/send-item-email", {
          toEmail,
          report,
        });

        toast.success("Item report emailed successfully!");
      }
    } catch (error) {
      console.error("Item report export failed:", error);
      toast.error("Failed to export item report.");
    }
  };

  const exportCustomerLedger = async (
    type: "print" | "excel" | "pdf" | "email"
  ) => {
    try {
      console.log("Fetching customer ledger...");
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";
      const res = await api.get(`/report/ledger`, {
        params: { startDate, endDate },
      });
      console.log("Customer ledger response:", res.data);
      const customerLedgerData = res.data.report;

      if (!customerLedgerData || customerLedgerData.length === 0) {
        toast.error("No customer ledger data available");
        return;
      }

      if (type === "print" || type === "pdf") {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Customer Ledger", 14, 15);

        autoTable(doc, {
          startY: 25,
          head: [
            [
              "Customer ID",
              "Name",
              "Email",
              "Total Items Bought",
              "Total Spent",
              "Last Purchase",
            ],
          ],
          body: customerLedgerData.map((customer: any) => [
            customer.customerId,
            customer.customerName,
            customer.email,
            customer.totalItemsBought,
            customer.totalSpent,
            new Date(customer.lastPurchaseDate).toLocaleDateString(),
          ]),
        });

        if (type === "print") {
          window.open(doc.output("bloburl"), "_blank");
        } else {
          doc.save(`customer-ledger-${Date.now()}.pdf`);
        }
      }

      if (type === "excel") {
        const worksheet = XLSX.utils.json_to_sheet(customerLedgerData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Ledger");
        XLSX.writeFile(workbook, `customer-ledger-${Date.now()}.xlsx`);
      }

      if (type === "email") {
        const toEmail = "fasilu707@gmail.com";
        if (!toEmail) return;

        await api.post("/report/send-customer-ledger-email", {
          toEmail,
          report: { customers: customerLedgerData },
        });

        toast.success("Customer ledger emailed successfully!");
      }
    } catch (error) {
      console.error("Error exporting customer ledger:", error);
      toast.error("Failed to export customer ledger");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newItem: any = {
        itemName,
        category,
        price: Number(price),
        quantity: Number(quantity),
        description:  description || '',
        purchasedBy: selectedCustomers.map((customer) => customer?.id),
      };

      // Validate with Zod
      const validatedData = inventoryItemSchema.parse(newItem);

      const result = await addInventoryItem(validatedData);
      setInventoryItems((prev) => [...prev, result.data]);
      setShowAddModal(false);
      toast.success("Item added successfully!");
      setErrors({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path[0];
          if (path) fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Validation failed. Please check the form.");
      } else {
        console.error("Add item error:", error);
        toast.error(error.message || "Failed to add item");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editItemName || !editCategory || !editPrice || !editQuantity) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const updatedItem = {
        itemName: editItemName,
        category: editCategory,
        price: Number(editPrice),
        quantity: Number(editQuantity),
        description: editDescription,
        purchasedBy: selectedCustomers.map((c) => c.id), // send user IDs
      };
      if (!selectedItem) return;

      const response = await updateInventoryItem(selectedItem.id, updatedItem);

      if (response.updated) {
        toast.success("Item updated successfully!");
        const updatedItemFromBackend = response.updated;
        if (!selectedItem) return;
        setInventoryItems((prev: any) =>
          prev.map((item: any) =>
            item.id === selectedItem.id ? updatedItemFromBackend : item
          )
        );

        setShowEditModal(false);
        setSelectedItem(null);
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update item.");
    }
  };

  const handleDelete = async (item: any) => {
    try {
      setShowDeleteConfirm(true);

      const response = await deleteInventoryItem(item.id);

      if (response.status === 200) {
        toast.success("Item deleted successfully!");
        setShowDeleteConfirm(false);
        setInventoryItems((prev: any) =>
          prev.filter((invItem: any) => invItem.id !== item.id)
        );
      } else {
        toast.error("Failed to delete item.");
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete item.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Inventory Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-lg hover:from-indigo-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <Plus size={18} className="mr-2" />
          Add New Item
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            📦 Item Report
          </h2>
          <span className="text-sm text-slate-500">
            {/* Total Items: {itemReport.length} */}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => exportItemReport("print")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <Printer size={18} />
            <span>Print</span>
          </button>

          <button
            onClick={() => exportItemReport("excel")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <Download size={18} />
            <span>Excel</span>
          </button>

          <button
            onClick={() => exportItemReport("pdf")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <FileText size={18} />
            <span>PDF</span>
          </button>

          <button
            onClick={() => exportItemReport("email")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <Mail size={18} />
            <span>Email</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            📖 Customer Ledger
          </h2>
          <span className="text-sm text-slate-500">
            {/* Total Customers: {customerLedger.length} */}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => exportCustomerLedger("print")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <Printer size={18} />
            <span>Print</span>
          </button>

          <button
            onClick={() => exportCustomerLedger("excel")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <Download size={18} />
            <span>Excel</span>
          </button>

          <button
            onClick={() => exportCustomerLedger("pdf")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <FileText size={18} />
            <span>PDF</span>
          </button>

          <button
            onClick={() => exportCustomerLedger("email")}
            className="btn btn-outline flex items-center gap-1 border-slate-300"
          >
            <Mail size={18} />
            <span>Email</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-slate-800">
            Total Items: {inventoryItems.length}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => exportData("print")}
              className="btn btn-secondary"
            >
              <Printer size={18} className="mr-1" />
              Print
            </button>
            <button
              onClick={() => exportData("excel")}
              className="btn btn-secondary"
            >
              <Download size={18} className="mr-1" />
              Excel
            </button>
            <button
              onClick={() => exportData("pdf")}
              className="btn btn-secondary"
            >
              <FileText size={18} className="mr-1" />
              PDF
            </button>
            <button
              onClick={() => exportData("email")}
              className="btn btn-secondary"
            >
              <Mail size={18} className="mr-1" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-indigo-500/90 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 border-2 border-slate-100/90 focus:border-indigo-300/70 focus:ring-2 focus:ring-indigo-100/30 placeholder-slate-400/80 text-slate-700 transition-all duration-200 outline-none shadow-sm hover:shadow-md"
            />
          </div>

          {/* Category Select */}
          <div className="relative w-full md:w-[240px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-3 appearance-none bg-white/90 border-2 border-slate-100/90 rounded-xl text-slate-600 focus:border-indigo-300/70 focus:ring-2 focus:ring-indigo-100/30 transition-all duration-200 outline-none"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="text-slate-600"
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-indigo-500/90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Filter Button */}
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:to-purple-700 text-white/90 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 text-white/90" />
            <span>Filters</span>
            <span className="ml-2 px-2.5 py-1 bg-white/20 rounded-full text-xs font-medium">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center"
                  >
                    ID
                    {sortField === "id" &&
                      (sortDirection === "asc" ? (
                        <SortAsc size={14} className="ml-1" />
                      ) : (
                        <SortDesc size={14} className="ml-1" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("itemName")}
                    className="flex items-center"
                  >
                    Name
                    {sortField === "itemName" &&
                      (sortDirection === "asc" ? (
                        <SortAsc size={14} className="ml-1" />
                      ) : (
                        <SortDesc size={14} className="ml-1" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center"
                  >
                    Category
                    {sortField === "category" &&
                      (sortDirection === "asc" ? (
                        <SortAsc size={14} className="ml-1" />
                      ) : (
                        <SortDesc size={14} className="ml-1" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center"
                  >
                    Price
                    {sortField === "price" &&
                      (sortDirection === "asc" ? (
                        <SortAsc size={14} className="ml-1" />
                      ) : (
                        <SortDesc size={14} className="ml-1" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("quantity")}
                    className="flex items-center"
                  >
                    Quantity
                    {sortField === "quantity" &&
                      (sortDirection === "asc" ? (
                        <SortAsc size={14} className="ml-1" />
                      ) : (
                        <SortDesc size={14} className="ml-1" />
                      ))}
                  </button>
                </th>

                <th className="px-4 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems?.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 hidden md:table-cell">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                    ${item?.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openItemDetails(item)}
                        className="p-1 text-slate-600 hover:text-purple-600 rounded-full hover:bg-purple-50"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-1 text-slate-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                        title="Edit Item"
                        onClick={() => {
                          setSelectedItem(item); // Pass the item you're editing
                          setEditItemName(item.itemName);
                          setEditCategory(item.category);
                          setEditPrice(item.price);
                          setEditQuantity(item.quantity);
                          setEditDescription(item.description || "");
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1 text-slate-600 hover:text-red-600 rounded-full hover:bg-red-50"
                        title="Delete Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {inventoryItems.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No inventory items found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          {/* Gradient Overlay */}
          <div
            className="fixed inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/20"
            onClick={() => setShowAddModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl z-10 w-full max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100">
            {/* Glossy Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Package size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white/90 tracking-tight">
                    Add New Inventory Item
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-full h-full bg-purple-500 animate-progress-glow"></div>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 bg-gradient-to-b from-white to-slate-50/70"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Tag size={16} className="mr-2 text-slate-500" />
                    Item Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all placeholder-slate-400"
                  />
                  {errors.itemName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.itemName}
                    </p>
                  )}
                </div>

                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <List size={16} className="mr-2 text-slate-500" />
                    Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 appearance-none bg-white pr-10"
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((c) => c !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}

                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-4 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <DollarSign size={16} className="mr-2 text-slate-500" />
                    Price
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      step="1.00"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 pl-10"
                    />
                    <span className="absolute left-4 top-3.5 text-slate-400">
                      $
                    </span>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Hash size={16} className="mr-2 text-slate-500" />
                    Quantity
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.quantity}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <AlignLeft size={16} className="mr-2 text-slate-500" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe item features..."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.description ? "border-red-300" : "border-slate-200"
                  } focus:border-purple-300 focus:ring-2 focus:ring-purple-100 h-32 resize-none`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Customer Search */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <User size={16} className="mr-2 text-slate-500" />
                  Purchased By
                  <span className="text-slate-400 ml-1">(optional)</span>
                </label>

                {/* Selected Chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCustomers.map((customer) => (
                    <span
                      key={customer?.id}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {customer?.name}
                      <button
                        className="ml-2 text-purple-500 hover:text-purple-700"
                        onClick={() =>
                          setSelectedCustomers((prev) =>
                            prev.filter((c) => c?.id !== customer?.id)
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <Combobox
                    value={null}
                    onChange={(newCustomer: any) => {
                      if (
                        newCustomer &&
                        !selectedCustomers.some(
                          (c) => c?.id === newCustomer?.id
                        )
                      ) {
                        setSelectedCustomers((prev) => [...prev, newCustomer]);
                      }
                    }}
                  >
                    <div className="relative">
                      <Combobox.Input
                        value={customerQuery}
                        onChange={(e) => setCustomerQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 pr-10"
                        placeholder="Search customers..."
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown size={16} className="text-slate-400" />
                      </Combobox.Button>
                    </div>

                    {/* Add this */}
                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {customers
                        .filter((customer) =>
                          customer.name
                            .toLowerCase()
                            .includes(customerQuery.toLowerCase().trim())
                        )
                        .filter(
                          (customer) =>
                            !selectedCustomers.some(
                              (c) => c?.id === customer?.id
                            )
                        )
                        .map((customer) => (
                          <Combobox.Option
                            key={customer.id}
                            value={customer}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-purple-100 text-purple-900"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {customer.name}
                                </span>
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                    </Combobox.Options>
                  </Combobox>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 font-medium transition-all duration-200 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Save Item
                  </span>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </form>

            {/* Decorative Elements */}
            <div className="absolute -top-4 right-4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-float-delayed"></div>
          </div>
        </div>
      )}

      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          {/* Gradient Overlay */}
          <div
            className="fixed inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/20"
            onClick={() => setShowEditModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl z-10 w-full max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100">
            {/* Glossy Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Package size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white/90 tracking-tight">
                    Edit Inventory Item
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleEditSubmit}
              className="p-6 space-y-6 bg-gradient-to-b from-white to-slate-50/70"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Tag size={16} className="mr-2 text-slate-500" />
                    Item Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <List size={16} className="mr-2 text-slate-500" />
                    Category<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 pr-10 bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((c) => c !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-4 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <DollarSign size={16} className="mr-2 text-slate-500" />
                    Price<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) =>
                        setEditPrice(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="0.00"
                      step="1.00"
                      min="0"
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                    />
                    <span className="absolute left-4 top-3.5 text-slate-400">
                      $
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Hash size={16} className="mr-2 text-slate-500" />
                    Quantity<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) =>
                      setEditQuantity(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <AlignLeft size={16} className="mr-2 text-slate-500" />
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe item features, specifications, and other details..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 h-32 resize-none"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Max 500 characters</span>
                  <span>{editDescription?.length || 0}/500</span>
                </div>
              </div>

              {/* Purchased By Section */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <User size={16} className="mr-2 text-slate-500" />
                  Purchased By
                  <span className="text-slate-400 ml-1">(optional)</span>
                </label>

                {/* Selected Chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCustomers.map((customer) => (
                    <span
                      key={customer?.id}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {customer?.name}
                      <button
                        className="ml-2 text-purple-500 hover:text-purple-700"
                        onClick={() =>
                          setSelectedCustomers((prev) =>
                            prev.filter((c) => c?.id !== customer?.id)
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <Combobox
                    value={null}
                    onChange={(newCustomer) => {
                      if (
                        newCustomer &&
                        !selectedCustomers.some(
                          (c) => c?.id === newCustomer?.id
                        )
                      ) {
                        setSelectedCustomers((prev) => [...prev, newCustomer]);
                      }
                    }}
                  >
                    <div className="relative">
                      <Combobox.Input
                        value={customerQuery}
                        onChange={(e) => setCustomerQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 pr-10"
                        placeholder="Search customers..."
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown size={16} className="text-slate-400" />
                      </Combobox.Button>
                    </div>

                    {/* Add this */}
                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {customers
                        .filter((customer) =>
                          customer.name
                            .toLowerCase()
                            .includes(customerQuery.toLowerCase().trim())
                        )
                        .filter(
                          (customer) =>
                            !selectedCustomers.some(
                              (c) => c?.id === customer?.id
                            )
                        )
                        .map((customer) => (
                          <Combobox.Option
                            key={customer.id}
                            value={customer}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-purple-100 text-purple-900"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {customer.name}
                                </span>
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                    </Combobox.Options>
                  </Combobox>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && !showDeleteConfirm && !showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeItemDetails}
          ></div>
          <div className="bg-white rounded-xl shadow-xl z-10 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                Item Details
              </h3>
              <button
                onClick={closeItemDetails}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Item ID
                  </h4>
                  <p className="text-slate-800 font-medium">
                    {selectedItem.id}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Category
                  </h4>
                  <p className="text-slate-800">{selectedItem.category}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Name
                  </h4>
                  <p className="text-slate-800 font-medium">
                    {selectedItem.itemName}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Price
                  </h4>
                  <p className="text-slate-800 font-medium">
                    ${selectedItem.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Quantity
                  </h4>
                  <p className="text-slate-800">{selectedItem.quantity}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Status
                  </h4>
                  <span
                    className={`badge ${
                      selectedItem.status === "In Stock"
                        ? "badge-success"
                        : selectedItem.status === "Low Stock"
                        ? "badge-warning"
                        : "badge-danger"
                    }`}
                  >
                    {selectedItem.status}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Description
                  </h4>
                  <p className="text-slate-800">{selectedItem.description}</p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    Last Updated
                  </h4>
                  <p className="text-slate-800">{selectedItem.lastUpdated}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={closeItemDetails}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-xl z-10 w-full max-w-md p-6">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">
              Confirm Deletion
            </h3>
            <p className="text-center text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedItem.itemName}</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedItem(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(`Deleting item: ${selectedItem.id}`);
                  setShowDeleteConfirm(false);
                  setSelectedItem(null);
                }}
                className="btn btn-danger"
              >
                <Trash2 size={18} className="mr-1" />
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
