import { createContext, useState, useEffect, useContext } from "react";
import { db, auth } from "../services/config";
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import { useAuthContext } from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {

    const { dbUser } = useAuthContext();
    const [restaurant, setRestaurant] = useState(null);
    const [basket, setBasket] = useState(null)
    const [basketDishes, setBasketDishes] = useState([])
    const [price, setPrice] = useState(0);

    useEffect(() => {
        // Calculate the price whenever the basket dishes change
        const newTotal = basketDishes.reduce((acc, dish) => {
            return acc + (dish.quantity * parseFloat(dish.dish.price));
        }, 0);
        setPrice(newTotal);
    }, [basketDishes]);

    useEffect(() => {
        if (basket) {
            const fetchBasketDishes = async () => {
                try {
                    const q = query(collection(db, "basketDish"), where("basketId", "==", basket.id));
                    const querySnapshot = await getDocs(q);
                    const dishes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setBasketDishes(dishes);
                } catch (error) {
                    console.error("Error fetching dishes for basket:", error);
                    Alert.alert("Error", "Failed to fetch dishes for the basket.");
                }
            };
            fetchBasketDishes();
        } else {
            setBasketDishes([]); // Clear dishes if no basket is present
        }
    }, [basket]);

    useEffect(() => {
        if (dbUser && restaurant) {
            const fetchBasket = async () => {
                try {
                    const q = query(collection(db, "basket"),
                        where("restaurantId", "==", restaurant.id),
                        where("userId", "==", dbUser.id));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        // Assuming there's only one basket document per user and restaurant
                        const basketDoc = querySnapshot.docs[0];
                        setBasket({ id: basketDoc.id, ...basketDoc.data() });
                    } else {
                        // Basket not found, set basket to null or any default value
                        setBasket(null);
                    }
                } catch (error) {
                    console.error("Error fetching basket:", error);
                    Alert.alert("Error", "There was an error fetching your basket.");
                }
            };
            fetchBasket();
        }
    }, [dbUser, restaurant]);

    const createNewBasket = async () => {
        if (dbUser && restaurant) {
            console.log('Trying to create new basket');
            try {
                const newBasket = {
                    userId: dbUser.id,
                    restaurantId: restaurant.id,
                    items: [], // Initially empty or set up with default items
                };
                const docRef = await addDoc(collection(db, "basket"), newBasket);
                const createdBasket = { id: docRef.id, ...newBasket }; // Correctly assign id here
                setBasket(createdBasket);
                Alert.alert("Success", "New basket created.");
                console.log('New basket created :)', createdBasket);
                return createdBasket; // Returning the new basket including its ID
            } catch (error) {
                console.error("Error creating new basket:", error);
                Alert.alert("Error", "Unable to create a new basket.");
                return null;
            }
        } else {
            Alert.alert("Missing Information", "Cannot create basket without user and restaurant info.");
            return null;
        }
    };

    const addDishToBasket = async (dish, quantity) => {
        let theBasket = basket || await createNewBasket();
        if (!theBasket) {
            Alert.alert("Error", "Failed to obtain basket information.");
            console.log('Basket does not exist :/');
            return;
        }
        console.log('This is my basket', theBasket);
        try {
            const basketDishData = {
                quantity: quantity,
                dish: dish,
                basketId: theBasket.id 
            };
            await addDoc(collection(db, "basketDish"), basketDishData);
            setBasketDishes([...basketDishes, basketDishData])
            Alert.alert("Success", "Dish added to the basket.");
        } catch (error) {
            console.error("Error adding dish to basket:", error);
            Alert.alert("Error", "Failed to add dish to the basket.");
        }
    };

    return (
        <BasketContext.Provider value={{ addDishToBasket, restaurant, setRestaurant, basket, basketDishes, price }}>
            {children}
        </BasketContext.Provider>
    )
}

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);