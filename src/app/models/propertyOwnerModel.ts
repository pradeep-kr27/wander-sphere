import * as admin from 'firebase-admin';

const db = admin.firestore();

class PropertyOwnerModel {
    constructor(public uid: string, public name: string, public email: string) { }

    // Method to post travel catalogues
    async postCatalogues(catalogueData: any) {
        try {
            const propertyOwnerRef = db.collection('propertyOwners').doc(this.uid);
            await propertyOwnerRef.collection('catalogues').add(catalogueData);
            return 'Catalogue posted successfully';
        } catch (error: any) {
            throw new Error('Error posting catalogue: ' + error.message);
        }
    }
}

module.exports = PropertyOwnerModel;
