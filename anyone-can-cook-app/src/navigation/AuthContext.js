import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../services/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user);
                fetchDbUser(user.uid);
            } else {
                setAuthUser(null);
                setDbUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchDbUser = async (uid) => {
        setLoading(true);
        try {
            const userDoc = doc(db, "users", uid);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                setDbUser({ id: uid, ...docSnap.data() });
            } else {
                console.log("No such document!");
                setDbUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                firstName,
                lastName,
                email,
            });
            fetchDbUser(userCredential.user.uid);
        } catch (error) {
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setAuthUser(userCredential.user);
            fetchDbUser(userCredential.user.uid);
        } catch (error) {
            throw error;
        }
    };

    const logOut = async () => {
        await signOut(auth);
        setAuthUser(null);
        setDbUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ authUser, dbUser, loading, signUp, signIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);