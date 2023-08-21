import * as admin from 'firebase-admin';

const db = admin.firestore();

class TravellerModel {
  constructor(public uid: string, public name: string, public email: string) {
    // ...other fields specific to Traveller
  }

  async getBookings() {
    try {
      const bookingsSnapshot = await db.collection('travellers').doc(this.uid).collection('bookings').get();
      const bookings: any[] = [];
      bookingsSnapshot.forEach((bookingDoc) => {
        bookings.push(bookingDoc.data());
      });
      return bookings;
    } catch (error: any) {
      throw new Error('Error fetching bookings: ' + error.message);
    }
  }

  async exploreCatalogues() {
    try {
      const cataloguesSnapshot = await db.collection('propertyOwners').get();
      const catalogues: any[] = [];
      cataloguesSnapshot.forEach((propertyOwnerDoc) => {
        catalogues.push(propertyOwnerDoc.data());
      });
      return catalogues;
    } catch (error: any) {
      throw new Error('Error exploring catalogues: ' + error.message);
    }
  }
}

export default TravellerModel;