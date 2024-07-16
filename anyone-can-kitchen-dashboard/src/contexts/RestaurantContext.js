import { createContext, useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/config";
import useAuth from "./useAuth";

const RestaurantContext = createContext({});

const RestaurantContextProvider = ({ children }) => {
    const { user } = useAuth();
    const loggedInUserId = user?.uid;
    const [restaurant, setRestaurant] = useState(null); // Initialize with null to handle loading state

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!loggedInUserId) {
                setRestaurant(null); // Reset restaurant state if user is not logged in
                return;
            }

            try {
                const q = query(collection(db, "restaurants"), where("adminSub", "==", loggedInUserId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Set the first restaurant found for the user
                    setRestaurant(querySnapshot.docs[0].data());
                } else {
                    console.log("No restaurant found for this adminId");
                    setRestaurant(null); // Set to null if no restaurant is found
                }
            } catch (error) {
                console.error("Error fetching restaurant:", error);
                setRestaurant(null); // Set to null on error
            }
        };

        fetchRestaurant();
    }, [loggedInUserId]);

    return (
        <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
            {children}
        </RestaurantContext.Provider>
    );
};

export default RestaurantContextProvider;

export const useRestaurantContext = () => useContext(RestaurantContext);