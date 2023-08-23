import * as admin from 'firebase-admin';

class TravellerModel {
  constructor(public uid: string, public name: string, public email: string) {
    // ...other fields specific to Traveller
  }

  async getBookings() {
    try {
      const db = admin.firestore();
      const bookingsSnapshot = await db.collection('bookings').where('travellerUid', '==', this.uid).get();
      const bookings = bookingsSnapshot.docs.map(doc => doc.data());
      return bookings;
    } catch (error: any) {
      throw new Error('Error fetching bookings: ' + error.message);
    }
  }

  async exploreCatalogues() {
    try {
      const db = admin.firestore();
      const cataloguesSnapshot = await db.collection('catalogues').get();
      const catalogues = cataloguesSnapshot.docs.map(doc => doc.data());
      return catalogues;
    } catch (error: any) {
      throw new Error('Error exploring catalogues: ' + error.message);
    }
  }
}

export default TravellerModel;