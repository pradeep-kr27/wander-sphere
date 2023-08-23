import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import PropertyOwnerModel from "../models/propertyOwnerModel";

// Property Owner login (after approval)

// Post travel catalogues
export const postTravelCatalogue = async (req: Request, res: Response) => {
    try {
        const { uid, title, description, images } = req.body;
        const db = admin.firestore();

        // Save travel catalogue in Firestore
        const propertyOwnerModel = new PropertyOwnerModel(uid,"","");
        await propertyOwnerModel.postCatalogues(title, description, images)

        res.status(201).json({ message: 'Travel catalogue posted successfully' });
    } catch (error) {
        console.log('propertyOwner Controller - postTravelCatalogue - error: ', error);
        res.status(500).json({ error: 'Failed to post travel catalogue' });
    }
};
