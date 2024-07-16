import { createContext, useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/config";
import useAuth from "./useAuth";

const RestaurantContext = createContext({});

const RestaurantContextProvider = ({ children }) => {
    const { user } = useAuth();
    const loggedInUserId = user?.uid;
    const [restaurant, setRestaurant] = useState(null);
    const [restaurantDocRefId, setRestaurantDocRefId] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            // Reset restaurant and it's doc ref state if user is not logged in
            if (!loggedInUserId) {
                setRestaurant(null);
                setRestaurantDocRefId(null);
                return;
            }

            try {
                const q = query(collection(db, "restaurants"), where("adminSub", "==", loggedInUserId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Set the first restaurant found for the user
                    const restaurantData = querySnapshot.docs[0].data();
                    const restaurantId = querySnapshot.docs[0].id;
                    setRestaurant({ ...restaurantData, id: restaurantId });
                    setRestaurantDocRefId(restaurantId);
                } else {
                    console.log("No restaurant found for this adminId");
                    setRestaurant(null);
                    setRestaurantDocRefId(null);
                }
            } catch (error) {
                console.error("Error fetching restaurant:", error);
                setRestaurant(null);
                setRestaurantDocRefId(null);
            }
        };

        fetchRestaurant();
    }, [loggedInUserId]);

    return (
        <RestaurantContext.Provider value={{ restaurant, setRestaurant, restaurantDocRefId }}>
            {children}
        </RestaurantContext.Provider>
    );
};

export default RestaurantContextProvider;

export const useRestaurantContext = () => useContext(RestaurantContext);