import express from 'express';
import { postTravelCatalogue } from '../controllers/propertyOwnerController';
import { isAuthenticated } from '../middlewares/authenticate';
import { isAuthorized } from '../middlewares/authorize';

const router = express.Router();

// Define Property Owner routes

router.post('/catalogue', isAuthenticated,isAuthorized({ hasRole: ['admin','property_owner']}), isAuthorized({ hasRole: [], allowSameUser: true }), postTravelCatalogue);

export default router;