import { createContext, useState, useEffect, useContext, Children } from "react";
import { auth, db } from "../services/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {

    const [authUser, setAuthUser] = useState(null)
    const [dbUser, setDbUser] = useState(null)
    const [uid, setUID] = useState(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user);
                setUID(user.uid)
            } else {
                console.log("No user logged in");
                setAuthUser(null);
                setUID(null)
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (uid) {
            const fetchUser = async () => {
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
                }
            };

            fetchUser();
        }
    }, [uid]);

    const signUp = async (email, password, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                firstName,
                lastName,
                email,
            });
            //setAuthUser(userCredential.user);
        } catch (error) {
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setAuthUser(userCredential.user);
        } catch (error) {
            throw error;
        }
    };

    const logOut = async () => {
        await signOut(auth);
        setAuthUser(null);
        setDbUser(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, dbUser, uid, setDbUser, signUp, signIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuthContext = () => useContext(AuthContext)