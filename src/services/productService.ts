'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  link: string;
};

export async function getProducts(): Promise<Product[]> {
  try {
    if (!db) {
      console.log("Firebase is not configured, so no products can be fetched.");
      return [];
    }
    const productsCol = collection(db, 'products');
    const q = query(productsCol);
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    return productList;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Re-throw a more specific error to be handled by the UI component.
    // This is often due to Firestore security rules not being configured.
    throw new Error("Could not retrieve products from the database. Please check your Firestore security rules to ensure the 'products' collection is readable.");
  }
}
