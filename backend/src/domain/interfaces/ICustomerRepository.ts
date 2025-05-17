import { Customer } from '../entities/Customer';

export interface ICustomerRepository {
  createCustomer(customer: Customer): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>; 
  getAllCustomers(): Promise<Customer[]>;
}
