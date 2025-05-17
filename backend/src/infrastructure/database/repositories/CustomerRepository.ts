import { ICustomerRepository } from '../../../domain/interfaces/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';
import { CustomerModel } from '../models/CustomerModel';

export class CustomerRepository implements ICustomerRepository {
    async createCustomer(customer: Customer): Promise<Customer> {
      const created = await CustomerModel.create({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      });
  
      return new Customer(
        created._id.toString(),
        created.name,
        created.email,
        created.phone,
        created.address
      );
    }
  
    async findByEmail(email: string): Promise<Customer | null> {
      const found = await CustomerModel.findOne({ email });
      if (!found) return null;
      
      return new Customer(
        found._id.toString(),
        found.name,
        found.email,
        found.phone,
        found.address
      );
    }

    async findById(id: string): Promise<Customer | null> {
      const found = await CustomerModel.findById(id);
      if (!found) return null;
  
      return new Customer(
        found._id.toString(),
        found.name,
        found.email,
        found.phone,
        found.address
      );
    }

    async getAllCustomers(): Promise<Customer[]> {
        const customers = await CustomerModel.find();
        return customers.map(c => new Customer(
          c._id.toString(),
          c.name,
          c.email,
          c.phone,
          c.address
        ));
    }
  }
