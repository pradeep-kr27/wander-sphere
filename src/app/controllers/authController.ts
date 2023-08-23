import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const register = async (req: Request, res: Response) => {
    try {
        console.log('authController - register function');
        const db = admin.firestore();
        console.log(req.body)
        let { displayName, password, email, isPropertyOwner } = req.body

        let role = isPropertyOwner ? process.env.ROLE_PROPERTY_OWNER : process.env.ROLE_TRAVELLER;
        if (email === "pradeep.ravibaskar@admin.wandersphere.com") role = process.env.ROLE_ADMIN;
        if (!displayName || !password || !email) {
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
            return res.status(403).json({ error: 'Property owner not approved' });
        } else {
            await db.collection('travellers').doc(uid).set({
                displayName,
                email
            });
        }

        return res.status(201).json({ message: 'Registered successfully', token, uid, expiresIn: 3600 });

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
        console.log(userRecord)
        // Generate Firebase ID token
        // const token = await admin.auth().createCustomToken(userRecord.user.uid);
        const token = (await userRecord.user.getIdTokenResult()).token;
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        console.log('decoded token', decodedToken)
        let uid = decodedToken.uid;
        let isPropertyOwner = decodedToken.role === process.env.ROLE_PROPERTY_OWNER;
        const db = admin.firestore();
        if (isPropertyOwner) {
            const propertyOwnerSnapshot = await db.collection('propertyOwners').doc(userRecord.user.uid).get();
            const propertyOwnerData = propertyOwnerSnapshot.data();

            if (!propertyOwnerData || !propertyOwnerData.approved) {
                return res.status(403).json({ error: 'Property owner not approved' });
            }

        }
        let role = "user";
        let expiresIn = 3600; // 1hr
        if (decodedToken.role === process.env.ROLE_PROPERTY_OWNER) {
            role = "property owner";
            expiresIn = 300; // 5mins
        }
        else if (decodedToken.role === process.env.ROLE_ADMIN) role = "admin"

        return res.status(201).json({ token, role, uid, expiresIn })
        // Generate and return JWT token
    } catch (error) {
        // Handle error
        console.log("authController - login function", error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

