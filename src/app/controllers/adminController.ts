import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

const db = admin.firestore();


// Get list of pending property owners for approval
export const getPendingPropertyOwners = async (req: Request, res: Response) => {
    try {
        // Retrieve property owners pending approval from Firestore
        const pendingPropertyOwnersSnapshot = await db.collection('propertyOwners').where('approved', '==', false).get();
        const pendingPropertyOwners = pendingPropertyOwnersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(pendingPropertyOwners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get pending property owners' });
    }
};

// Approve a property owner
export const approvePropertyOwner = async (req: Request, res: Response) => {
    try {
        const { ownerId } = req.params;

        // Update the property owner's approval status in Firestore
        await db.collection('propertyOwners').doc(ownerId).update({
            approved: true,
        });

        res.status(200).json({ message: 'Property owner approved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve property owner' });
    }
};
