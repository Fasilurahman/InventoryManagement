import { Request, Response, NextFunction } from 'express';
import { CreateCustomerUseCase } from '../../application/useCases/Customer/CreateCustomerUseCase';
import { CustomerRepository } from '../../infrastructure/database/repositories/CustomerRepository';
import { GetAllCustomersUseCase } from '../../application/useCases/Customer/GetAllCustomersUseCase';

export class CustomerController {
    private createCustomerUseCase: CreateCustomerUseCase;
    private customerRepository: CustomerRepository;
    private getAllCustomersUseCase: GetAllCustomersUseCase;


    constructor() {
        this.customerRepository = new CustomerRepository();
        this.createCustomerUseCase = new CreateCustomerUseCase(this.customerRepository);
        this.getAllCustomersUseCase = new GetAllCustomersUseCase(this.customerRepository);
    }


    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { name, email, phone, address } = req.body;
  
          const customer = await this.createCustomerUseCase.execute(
            name,
            email,
            phone,
            address
          );
          res.status(201).json({ customer });
        } catch (error) {
          next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const customers = await this.getAllCustomersUseCase.execute();
          res.status(200).json({ customers });
        } catch (error) {
          next(error);
        }
    }  
}
