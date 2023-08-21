import express from 'express';
import { getPendingPropertyOwners, approvePropertyOwner } from '../controllers/adminController';
import { isAuthenticated } from '../middlewares/authenticate';
import { isAuthorized } from '../middlewares/authorize';

const router = express.Router();

// Define Admin routes
router.get('/pending-property-owners', isAuthenticated, isAuthorized({ hasRole: ['admin'] }), getPendingPropertyOwners);
router.put('/approve-property-owner/:ownerId', approvePropertyOwner);

export default router;
