import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { User } from '../../../domain/entities/User';
import UserModel from '../models/UserModel';

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({email})
        if (!user) {
            return null;
        }
        return new User(user._id.toString(), user.name, user.email, user.password);

    }

    async createUser(user: User): Promise<User> {
        const created = await UserModel.create({ name: user.name, email: user.email, password: user.password });
        return new User(created._id.toString(), created.name, created.email, created.password);
    }
}