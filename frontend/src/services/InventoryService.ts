import api from "../utils/axiosInstance";

interface InventoryItem {
    itemName: string;
    category: string;
    price: number;
    quantity: number;
    description: string;
    purchasedBy: string[]; 
  }
  
  export const addInventoryItem = async (item: InventoryItem) => {
    try {
      const response = await api.post("/inventory", item);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add inventory item");
    }
  };

  export const getInventoryItems = async () => {
    try {
      const response = await api.get("/inventory");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch inventory items");
    }
  }

export const updateInventoryItem = async (itemId: string, updatedItem: any) => {
    const response = await api.put(`/inventory/${itemId}`, updatedItem);
    return response.data; 
}

export const deleteInventoryItem = async (id: string) => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response; 
  } catch (error) {
    throw error;
  }
};