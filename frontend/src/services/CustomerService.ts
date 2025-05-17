import api from '../utils/axiosInstance';


export const createCustomer = async (customerData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  };

export const getCustomers = async () => {
    const response = await api.get('/customers');
    return response.data;
}