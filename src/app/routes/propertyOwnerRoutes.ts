import express from 'express';
import { postTravelCatalogue } from '../controllers/propertyOwnerController';
import { isAuthenticated } from '../middlewares/authenticate';
import { isAuthorized } from '../middlewares/authorize';

const router = express.Router();

// Define Property Owner routes

router.post('/catalogue', isAuthenticated, isAuthorized({ hasRole: ['property_owner','admin'] }), postTravelCatalogue);

export default router;