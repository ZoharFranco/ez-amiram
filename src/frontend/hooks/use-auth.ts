import { UsersRepository } from "@/backend/dal/repositories/users-repository";
import { auth } from "@/backend/services/external/firebase/firebase";
import { User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);


    const usersRepository = useMemo(() => new UsersRepository(), []);
    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                try {
                    const userProfile = await usersRepository.query(user.uid);
                    setIsAdmin(userProfile?.isAdmin || false);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [usersRepository]);

    return { user, isAdmin, loading };
} 