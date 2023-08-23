import * as admin from 'firebase-admin';


class PropertyOwnerModel {
    constructor(public uid: string, public name: string, public email: string) { }

    // Method to post travel catalogues
    async postCatalogues(title: string, description: string, images: []) {
        try {
            const db = admin.firestore();
            // Save travel catalogue in Firestore
            const catalogueRef = await db.collection('catalogues').add({
                title,
                description,
                images,
                ownerId: this.uid,
            });

            // Get the generated catalogue ID
            const catalogueId = catalogueRef.id;

            // Update the property owner document with the new catalogue ID
            await db.collection('propertyOwners').doc(this.uid).update({
                catalogues: admin.firestore.FieldValue.arrayUnion(catalogueId), // Add catalogue ID to property owner's catalogues array
            });

            return 'Catalogue posted successfully';
        } catch (error: any) {
            throw new Error('Error posting catalogue: ' + error.message);
        }
    }
}

export default PropertyOwnerModel;
