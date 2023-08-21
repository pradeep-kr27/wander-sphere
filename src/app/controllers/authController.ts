import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const db = admin.firestore();

export const register = async (req: Request, res: Response) => {
    try {
        console.log('authController - register function')
        let { displayName, password, email, ROLE } = req.body
        let role = ROLE?.toLowerCase() === 'property owner' ? process.env.ROLE_PROPERTY_OWNER : process.env.ROLE_TRAVELLER;
        if (!displayName || !password || !email || !role) {
            return res.status(400).send({ message: 'Missing fields' })
        }

        // // Check if user with the provided email already exists
        // const existingUser = await admin.auth().getUserByEmail(email);
        // console.log('existing user', existingUser);

        // if (existingUser) {
        //     return res.status(409).json({ error: 'User with this email already exists' });
        // }

        const { uid } = await admin.auth().createUser({
            displayName,
            password,
            email
        })
        console.log('user id', uid)


        await admin.auth().setCustomUserClaims(uid, { role })
        const token = await admin.auth().createCustomToken(uid);
        console.log('token', token);

        if (role === process.env.ROLE_PROPERTY_OWNER) {
            // Save property owner information in Firestore (pending approval)
            const propertyOwnerRef = await db.collection('propertyOwners').doc(uid).set({
                displayName,
                email,
                approved: false, // Property owner is pending approval
            });

        } else {
            await db.collection('travellers').doc(uid).set({
                displayName,
                email
            });
        }

        return res.status(201).json({ message: 'Registered successfully', token });

    } catch (err: any) {
        console.log("authController - register function", err);
        res.status(500).json({ error: err, message: "Failed to register" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        console.log('authController - login function');
        const { email, password } = req.body;

        if (!password || !email) {
            return res.status(400).send({ message: 'Missing fields' })
        }


        // Authenticate user and get UID
        const auth = getAuth();
        const userRecord = await signInWithEmailAndPassword(auth, email, password);

        // Generate Firebase ID token
        const token = await admin.auth().createCustomToken(userRecord.user.uid);
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        let isPropertyOwner = decodedToken.role === process.env.ROLE_PROPERTY_OWNER;
        if (isPropertyOwner) {
            const propertyOwnerSnapshot = await db.collection('propertyOwners').doc(userRecord.user.uid).get();
            const propertyOwnerData = propertyOwnerSnapshot.data();

            if (!propertyOwnerData || !propertyOwnerData.approved) {
                return res.status(403).json({ error: 'Property owner not approved' });
            }

        }

        return res.status(201).json({ token })
        // Generate and return JWT token
    } catch (error) {
        // Handle error
        console.log("authController - login function", error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

