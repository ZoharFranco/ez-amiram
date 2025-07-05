import { db } from '@/backend/services/external/firebase/firebase';
import { User } from '@/lib/types/user';

import { UserCredential } from 'firebase/auth';
import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
const usersCollection = collection(db, 'users');




export interface IUserRepository {
    save(user: UserCredential): Promise<void>;
    query(uid: string): Promise<User | null>;
    update(uid: string, user: User): Promise<void>; 
    delete(uid: string): Promise<void>;
}

export class UsersRepository implements IUserRepository {
    private readonly collection = "users";

    async save(user: UserCredential): Promise<void> {
        try {
        const userData = user.user;
        const userSearchQuery = query(usersCollection, where("uid", "==", userData.uid));
        const existingUser = await getDocs(userSearchQuery)
        if (!existingUser.empty) {
            return;
        }
        await addDoc(usersCollection, {
            uid: userData.uid,
            displayName: userData.displayName,
            email: userData.email,
            photoURL: userData.photoURL,
            createdAt: serverTimestamp(),
        })
        return;
        } catch (error) {
            throw error;
        }
    }

    async query(uid: string): Promise<User | null> {
        try {
            const userQuery = query(usersCollection, where("uid", "==", uid));
            const userSnapshot = await getDocs(userQuery);
            const user = userSnapshot.docs[0];
            if (user) {
                return user.data() as User;
            }
            return null;
        } catch (error) {
            console.error("Error querying user:", error);
            throw error;
        }
    }

    async getAll(): Promise<User[]> {
        try {
            const q = query(collection(db, this.collection));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as User);
        } catch (error) {
            console.error("Error getting all users:", error);
            throw error;
        }
    }

    async update(uid: string, data: Partial<User>): Promise<void> {
        try {
            const userQuery = query(usersCollection, where("uid", "==", uid));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                await updateDoc(userSnapshot.docs[0].ref, data);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async getAdmins(): Promise<User[]> {
        try {
            const q = query(collection(db, this.collection), where("isAdmin", "==", true));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as User);
        } catch (error) {
            console.error("Error getting admin users:", error);
            throw error;
        }
    }

    async delete(uid: string): Promise<void> {
        const userSearchQuery = query(usersCollection, where("uid", "==", uid));
        const userDoc = await getDocs(userSearchQuery)
        if (!userDoc.empty) {
            await deleteDoc(userDoc.docs[0].ref)
        }
    }
}
