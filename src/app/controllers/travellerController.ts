import * as admin from 'firebase-admin';
import { Request, Response } from 'express';

const db = admin.firestore();

// Retrieve bookings for a Traveller
export const getTravellerBookings = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid; // Assuming you pass UID as a parameter

        // Retrieve bookings for the Traveller from Firestore
        const bookingsSnapshot = await db.collection('bookings').where('travellerUid', '==', uid).get();
        const bookings = bookingsSnapshot.docs.map(doc => doc.data());

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get traveller bookings' });
    }
};

// Explore travel catalogues
export const exploreTravelCatalogues = async (req: Request, res: Response) => {
    try {
        // Retrieve travel catalogues from Firestore
        const cataloguesSnapshot = await db.collection('catalogues').get();
        const catalogues = cataloguesSnapshot.docs.map(doc => doc.data());

        res.status(200).json(catalogues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to explore travel catalogues' });
    }
};