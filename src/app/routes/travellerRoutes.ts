import express from 'express';
import {  getTravellerBookings, exploreTravelCatalogues } from '../controllers/travellerController';

const router = express.Router();

// Define Traveller routes
router.get('/:uid/bookings', getTravellerBookings);
router.get('/explore', exploreTravelCatalogues);

export default router;