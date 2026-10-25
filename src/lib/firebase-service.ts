import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Customer, Product, Invoice, CompanySettings, BillingSettings, StoneTypeSettings } from '@/types';

// Generic Firebase service class
class FirebaseService<T> {
  constructor(protected collectionName: string) {}

  async create(data: Omit<T, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async search(field: string, value: any): Promise<T[]> {
    const q = query(
      collection(db, this.collectionName),
      where(field, '==', value)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async getWithLimit(limitCount: number, orderByField?: string): Promise<T[]> {
    let q;
    if (orderByField) {
      q = query(
        collection(db, this.collectionName),
        orderBy(orderByField, 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(collection(db, this.collectionName), limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
}

// Specific service instances
export const customerService = new FirebaseService<Customer>('customers');
export const productService = new FirebaseService<Product>('products');
export const invoiceService = new FirebaseService<Invoice>('invoices');

// Settings services with specific methods
class SettingsService<T> extends FirebaseService<T> {
  async getSettings(): Promise<T | null> {
    const results = await this.getAll();
    return results.length > 0 ? results[0] : null;
  }

  async updateSettings(data: Partial<T>): Promise<void> {
    const existing = await this.getSettings();
    if (existing && typeof existing === 'object' && existing !== null && 'id' in existing) {
      await this.update((existing as any).id, data);
    } else {
      await this.create(data as Omit<T, 'id'>);
    }
  }
}

export const companySettingsService = new SettingsService<CompanySettings>('companySettings');
export const billingSettingsService = new SettingsService<BillingSettings>('billingSettings');
export const stoneTypeSettingsService = new SettingsService<StoneTypeSettings>('stoneTypeSettings');

// Invoice specific methods
class InvoiceService extends FirebaseService<Invoice> {
  async getNextInvoiceNumber(): Promise<string> {
    const settings = await billingSettingsService.getSettings();
    const prefix = settings?.invoicePrefix || 'INV';
    const nextNumber = settings?.nextInvoiceNumber || 1;
    
    // Update the next invoice number
    await billingSettingsService.updateSettings({
      nextInvoiceNumber: nextNumber + 1
    });
    
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  async searchByCustomer(customerName: string): Promise<Invoice[]> {
    const q = query(
      collection(db, this.collectionName),
      where('customer.name', '>=', customerName),
      where('customer.name', '<=', customerName + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invoice[];
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    const q = query(
      collection(db, this.collectionName),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invoice[];
  }

  async getRecentInvoices(count: number = 10): Promise<Invoice[]> {
    return this.getWithLimit(count, 'createdAt');
  }
}

export const enhancedInvoiceService = new InvoiceService('invoices');
