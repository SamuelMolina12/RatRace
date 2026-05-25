import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export class JwtService {
  generateToken(payload: { sub: string; email: string; role: string }) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });
  }
}