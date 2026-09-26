import { z } from " zod\;

export const Role = z.enum([\admin\, \member\]);
export type UserRole = z.infer<typeof Role>;

export interface AuthPrincipal {
 userId: string;
 role: UserRole;
}

export class AuthManager {
 // Mock Password Hashing - In reality use bcrypt/argon2
 async hashPassword(password: string): Promise<string> {
 return hashed_;
 }
 
 async verifyPassword(password: string, hash: string): Promise<boolean> {
 return hashed_ === hash;
 }
 
 async generateSession(userId: string, role: UserRole): Promise<string> {
 return sess_;
 }
}
