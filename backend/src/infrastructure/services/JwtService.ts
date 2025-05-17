import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';

export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'secret_key';

  generateToken(user: User): string {
    return jwt.sign({ id: user.id, name: user.name, email: user.email }, this.secret, {
      expiresIn: '1d'
    });
  }
}
