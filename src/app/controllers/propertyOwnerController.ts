import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Property Owner login (after approval)

// Post travel catalogues
export const postTravelCatalogue = async (req: Request, res: Response) => {
    try {
        const { uid, title, description, images } = req.body;


        // Save travel catalogue in Firestore
        await db.collection('catalogues').add({
            title,
            description,
            images,
            ownerId: uid,
        });

        res.status(201).json({ message: 'Travel catalogue posted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to post travel catalogue' });
    }
};
