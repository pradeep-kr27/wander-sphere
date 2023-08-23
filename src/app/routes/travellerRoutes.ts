import express from 'express';
import {  getTravellerBookings, exploreTravelCatalogues } from '../controllers/travellerController';
import { isAuthenticated } from '../middlewares/authenticate';
import { isAuthorized } from '../middlewares/authorize';

const router = express.Router();

// Define Traveller routes
router.get('/:id/bookings', isAuthenticated, isAuthorized({ hasRole: ['admin'], allowSameUser: true }),getTravellerBookings);
router.get('/explore', exploreTravelCatalogues);

export default router;