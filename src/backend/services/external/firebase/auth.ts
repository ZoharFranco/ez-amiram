import { User } from "@/lib/types/user";
import { initializeServerApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { app } from "./firebase";


export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserNotFoundError";
    }
}



export const requestAuth = async (headers: Headers): Promise<{ auth: Auth, currentUser: User }> => {
    const idToken = headers.get("Authorization")?.split("Bearer ")[1];
    if (!idToken) {
        throw new Error("Authorization token missing");
    }
    const firebaseServerApp = initializeServerApp(
        app,
        { authIdToken: idToken }
    );
    const auth = getAuth(firebaseServerApp);
    await auth.authStateReady();    
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new UserNotFoundError("User not found");
    }
    return { auth, currentUser: currentUser as User };
}
