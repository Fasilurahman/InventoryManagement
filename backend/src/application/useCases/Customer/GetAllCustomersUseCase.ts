import { ICustomerRepository } from '../../../domain/interfaces/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';
import { createError } from '../../../infrastructure/middlewares/errorHandler';
import { STATUS_CODES } from '../../../shared/statusCodes';

export class GetAllCustomersUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(): Promise<Customer[]> {
    try {
      return await this.customerRepository.getAllCustomers();
    } catch (error: any) {
      throw createError(
        error.message || 'Failed to fetch customers',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}