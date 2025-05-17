// src/application/usecases/auth/RegisterUseCase.ts
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { User } from '../../../domain/entities/User';
import bcrypt from 'bcrypt';
import { createError } from '../../../infrastructure/middlewares/errorHandler';
import { STATUS_CODES } from '../../../shared/statusCodes';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw createError('User already exists', STATUS_CODES.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User('', name, email, hashedPassword);
      
      return await this.userRepository.createUser(newUser);
    } catch (error: any) {
      throw createError(
        error.message || 'Registration failed',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}