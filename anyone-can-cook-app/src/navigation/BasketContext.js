import { createContext, useState, useEffect, useContext } from "react";
import { db, auth } from "../services/config";
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Alert } from "react-native";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [basket, setBasket] = useState(null)
    const [basketDishes, setBasketDishes] = useState([])

    const totalPrice = basketDishes.reduce((sum, item) => sum + item.quantity * parseFloat(item.dish.price), 0);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async currentUser => {
            setUser(currentUser);
            if (currentUser && restaurant) {
                await fetchOrCreateBasket(currentUser.uid, restaurant.id);
            } else {
                setBasket(null);  // Reset basket when there is no user
            }
        });

        return () => unsubscribe();
    }, [restaurant]);

    useEffect(() => {
        const fetchBasketDishes = async () => {
            if (basket && basket.id) {
                const basketDishesRef = collection(db, "basketDish");
                const q = query(basketDishesRef, where("basketId", "==", basket.id));
                try {
                    const querySnapshot = await getDocs(q);
                    const fetchedDishes = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    setBasketDishes(fetchedDishes);
                } catch (error) {
                    console.error("Error fetching basket dishes:", error);
                    Alert.alert("Error", "Failed to fetch dishes for the basket.");
                }
            } else {
                setBasketDishes([]);  // Clear the dishes if no basket is set
            }
        };

        fetchBasketDishes();
    }, [basket]);


    const addDishToBasket = async (dish, quantity) => {
        if (!user || !restaurant) return;
        let currentBasket = basket || await fetchOrCreateBasket(user.uid, restaurant.id);
        // Create basketDish collections with a document with dish, quantity, and basketId of previous basket document  
        if (!currentBasket) return;  // In case basket creation failed

        const basketDishesRef = collection(db, "basketDish");
        const newDishData = {
            dish: dish,
            quantity: quantity,
            basketId: basket.id
        };
        try {
            const docRef = await addDoc(basketDishesRef, newDishData);
            console.log('Dish added with ID: ', docRef.id);
            setBasketDishes([...basketDishes, newDishData])
            Alert.alert('Dish Added To Basket', 'The dish has been added to basket successfully')
        } catch (error) {
            console.error("Error adding dish to basket: ", error);
        }
    };

    const fetchOrCreateBasket = async (userId, restaurantId) => {
        if (!userId || !restaurantId) return;
        const basketsRef = collection(db, "baskets");
        const q = query(basketsRef, where("userId", "==", userId), where("restaurantId", "==", restaurantId));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const basketDoc = querySnapshot.docs[0]; // Assuming only one basket per user per restaurant should exist
            setBasket({ ...basketDoc.data(), id: basketDoc.id });
            return { ...basketDoc.data(), id: basketDoc.id };  // Return basket for potential immediate use
        } else {
            return await createNewBasket(userId, restaurantId);  // Create and then set the basket in state
        }
    };


    const createNewBasket = async (userId, restaurantId) => {
        const basketData = {
            userId: userId,
            restaurantId: restaurantId,
        };
        const basketRef = await addDoc(collection(db, "baskets"), basketData);
        return { ...basketData, id: basketRef.id };
    };

    return (
        <BasketContext.Provider value={{ addDishToBasket, restaurant, setRestaurant, basket, basketDishes, totalPrice }}>
            {children}
        </BasketContext.Provider>
    )
}

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);