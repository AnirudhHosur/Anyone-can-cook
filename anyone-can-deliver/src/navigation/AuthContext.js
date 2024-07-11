import { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Alert } from "react-native";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [dbCourier, setDbCourier] = useState(null);
    const [uid, setUID] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user);
                setUID(user.uid);
            } else {
                console.log("No user logged in");
                setAuthUser(null);
                setUID(null);
                setDbCourier(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCourier = async () => {
            try {
                if (uid) {
                    const courierDoc = doc(db, "courier", uid);
                    const docSnap = await getDoc(courierDoc);

                    if (docSnap.exists()) {
                        setDbCourier({ id: uid, ...docSnap.data() });
                    } else {
                        console.log("No courier document found");
                        setDbCourier(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching courier data:", error);
            }
        };

        fetchCourier();
    }, [uid]);

    const signUp = async (email, password, firstName, lastName, phoneNumber) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "courier", userCredential.user.uid), {
                firstName,
                lastName,
                email,
                phoneNumber,
            });
            // setAuthUser(userCredential.user);
        } catch (error) {
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setAuthUser(userCredential.user);
            Alert.alert('Sign in successful')
        } catch (error) {
            throw error;
        }
    };

    const logOut = async () => {
        await signOut(auth);
        setAuthUser(null);
        setDbCourier(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, dbCourier, uid, setDbCourier, signUp, signIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };