// src/application/usecases/auth/LoginUseCase.ts
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { JwtService } from '../../../infrastructure/services/JwtService';
import bcrypt from 'bcrypt';
import { createError } from '../../../infrastructure/middlewares/errorHandler';
import { STATUS_CODES } from '../../../shared/statusCodes';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw createError('User not found', STATUS_CODES.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw createError('Invalid password', STATUS_CODES.UNAUTHORIZED);
      }

      return this.jwtService.generateToken(user);
    } catch (error: any) {
      throw createError(
        error.message || 'Authentication failed',
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}