import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  type DocumentData,
  type WithFieldValue
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generic CRUD operations for Firestore
export const firestoreUtils = {
  // Create a new document in a collection
  async create(collectionName: string, data: WithFieldValue<DocumentData>) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error in ${collectionName}:`, error);
      throw error;
    }
  },

  // Read all documents in a collection
  async readAll<T extends DocumentData>(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as T
      }));
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error);
      throw error;
    }
  },

  // Update a document
  async update(collectionName: string, documentId: string, data: WithFieldValue<DocumentData>) {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return { id: documentId, ...data };
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName: string, documentId: string) {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      return documentId;
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      throw error;
    }
  }
}; 