import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import TravellerModel from "../models/travellerModel";

// Retrieve bookings for a Traveller
export const getTravellerBookings = async (req: Request, res: Response) => {
    try {
        // const db = admin.firestore();
        const uid = req.params.id; // Assuming you pass UID as a parameter
        const traveller = new TravellerModel(uid, '', ''); // Initialize with required fields
        // Retrieve bookings for the Traveller from Firestore
        const bookings = await traveller.getBookings()

        res.status(200).json(bookings);
    } catch (error) {
        console.log('Traveller Controller - getTravellerBookings - error: ', error)
        res.status(500).json({ error: 'Failed to get traveller bookings' });
    }
};

// Explore travel catalogues
export const exploreTravelCatalogues = async (req: Request, res: Response) => {
    try {
        // Retrieve travel catalogues from Firestore
        // const db = admin.firestore();
        
        const traveller = new TravellerModel('', '', ''); // Initialize with required fields
        const catalogues = await traveller.exploreCatalogues();

        res.status(200).json(catalogues);
    } catch (error) {
        console.log('Traveller Controller - getTravellerBookings - error: ', error)
        res.status(500).json({ error: 'Failed to explore travel catalogues' });
    }
};