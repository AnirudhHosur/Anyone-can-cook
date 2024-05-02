import { Children, createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/config';
import { useBasketContext } from './BasketContext';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { useAuthContext } from './AuthContext';

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {

    const { dbUser } = useAuthContext();

    const { restaurant, price, basketDishes, basket } = useBasketContext();
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            if (dbUser) {
                const ordersQuery = query(collection(db, "orders"), where("userId", "==", dbUser.id));
                const querySnapshot = await getDocs(ordersQuery);
                const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(fetchedOrders);
            }
            console.log('In here man', orders)
        };

        fetchOrders();
    }, [dbUser]);

    const createOrder = async () => {
        if (!dbUser || !restaurant || !basket) {
            console.error("Missing dbUser, restaurant, or basket data");
            return; // Early exit if necessary data is missing
        }

        try {
            const orderData = {
                userId: dbUser.id,
                restaurant: restaurant,
                status: 'NEW',
                totalPrice: price + (restaurant.deliveryFee || 0),
            };

            console.log('Golmal', orderData)
            const orderDocRef = await addDoc(collection(db, "orders"), orderData);

            const orderDishesPromises = basketDishes.map(basketDish =>
                addDoc(collection(db, "OrderDish"), {
                    quantity: basketDish.quantity,
                    orderId: orderDocRef.id,
                    dish: basketDish.dish
                }).catch(err => {
                    console.error("Failed to create OrderDish:", err);
                    throw err; // Re-throw to handle at a higher level if necessary
                })
            );

            await Promise.all(orderDishesPromises);

            const basketDishQuery = query(collection(db, "basketDish"), where("basketId", "==", basket.id));
            const basketDishSnapshot = await getDocs(basketDishQuery);
            const basketDishDeletePromises = basketDishSnapshot.docs.map(dishDoc =>
                deleteDoc(doc(db, "basketDish", dishDoc.id)).catch(err => {
                    console.error("Failed to delete BasketDish:", err);
                    throw err; // Re-throw to handle at a higher level if necessary
                })
            );

            await Promise.all(basketDishDeletePromises);
            await deleteDoc(doc(db, "basket", basket.id));

            setOrders(prevOrders => [...prevOrders, { ...orderData, id: orderDocRef.id }]);

        } catch (error) {
            console.error("Failed to complete order process:", error);
        }
    };

    const getOrder = async (id) => {
        if (!id) {
            console.error("Order ID is required to fetch order data.");
            return;
        }

        try {
            const orderRef = doc(db, "orders", id);
            const orderSnapshot = await getDoc(orderRef);

            if (orderSnapshot.exists()) {
                console.log("Order data:", orderSnapshot.data());
                const orderData = { id: orderSnapshot.id, ...orderSnapshot.data() };

                // Query to get OrderDish documents linked to this order
                const orderDishesQuery = query(collection(db, "OrderDish"), where("orderId", "==", id));
                const dishesSnapshot = await getDocs(orderDishesQuery);
                const orderDishes = dishesSnapshot.docs.map(dishDoc => ({
                    id: dishDoc.id, ...dishDoc.data()
                }));

                // Combine the order data with its dishes
                return { ...orderData, dishes: orderDishes };
            } else {
                console.log("No order found with ID:", id);
                return null; // or throw an error based on your error handling strategy
            }
        } catch (error) {
            console.error("Failed to fetch order:", error);
            throw error; // or return null based on your error handling strategy
        }
    };

    return (
        <OrderContext.Provider value={{ createOrder, orders, getOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);