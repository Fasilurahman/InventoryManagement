import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/useCases/Auth/loginUseCase';
import { RegisterUseCase } from '../../application/useCases/Auth/registerUseCase';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { JwtService } from '../../infrastructure/services/JwtService';

export class AuthController {
    private loginUseCase: LoginUseCase;
    private registerUseCase: RegisterUseCase;

    constructor() {
        const userRepository = new UserRepository();
        const jwtService = new JwtService();

        this.loginUseCase = new LoginUseCase(userRepository, jwtService);
        this.registerUseCase = new RegisterUseCase(userRepository);
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const user = await this.registerUseCase.execute(name, email, password);

            const { id, name: userName, email: userEmail } = user;

            res.status(201).json({
                user: {
                    id,
                    name: userName,
                    email: userEmail,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const token = await this.loginUseCase.execute(email, password);

            res.status(200).json({
                token,
            });
        } catch (error) {
            next(error); 
        }
    }
}
