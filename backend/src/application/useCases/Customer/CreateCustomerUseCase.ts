import { ICustomerRepository } from '../../../domain/interfaces/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';
import { createError } from '../../../infrastructure/middlewares/errorHandler';
import { STATUS_CODES } from '../../../shared/statusCodes';

export class CreateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(
    name: string,
    email: string,
    phone?: string,
    address?: string,
  ): Promise<Customer> {
    try {
      const existing = await this.customerRepository.findByEmail(email);
      if (existing) {
        throw createError('Customer already exists', STATUS_CODES.CONFLICT);
      }

      const customer = new Customer('', name, email, phone, address);
      return await this.customerRepository.createCustomer(customer);
    } catch (error: any) {
      throw createError(
        error.message || 'Failed to create customer',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}