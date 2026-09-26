import { Request, Response, NextFunction } from " express\;
import { AuthPrincipal, UserRole } from \@aacc/auth\;

export interface AuthenticatedRequest extends Request {
 principal?: AuthPrincipal;
}

export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
 // Mock session check - In reality read cookie/header and check DB/Redis
 const session = req.headers.authorization;
 if (!session) return res.status(401).json({ error: \Unauthorized\ });
 
 req.principal = { userId: \user-uuid\, role: \member\ };
 next();
};

export const requireRole = (role: UserRole) => {
 return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
 if (!req.principal || req.principal.role !== role) {
 return res.status(403).json({ error: \Forbidden: Insufficient permissions\ });
 }
 next();
 };
};
