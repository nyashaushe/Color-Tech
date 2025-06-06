import express, { Request, Response, NextFunction } from 'express';
import UserController from '../controllers/UserController';
import { authenticate } from '../middleware/auth'; // Assuming authenticate middleware exists

const router = express.Router();

// Middleware to check if the user is an admin (placeholder)
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if req.user exists and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    // User is not authenticated or not an admin
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

// Apply authentication to all user management routes
router.use(authenticate);
// Apply admin check to all user management routes
router.use(isAdmin);

// Define admin user management routes
router.get('/', UserController.getAllUsers);       // GET /api/users
router.get('/:id', UserController.getUserById);   // GET /api/users/:id
router.put('/:id', UserController.updateUser);     // PUT /api/users/:id
router.delete('/:id', UserController.deleteUser); // DELETE /api/users/:id
// Maybe add POST /:id/reset-password later if needed
// router.post('/:id/reset-password', UserController.resetPassword);

export default router;
