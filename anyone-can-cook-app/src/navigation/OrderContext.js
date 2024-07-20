import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/config';
import { useAuthContext } from './AuthContext';
import { useBasketContext } from './BasketContext';

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
    const { dbUser } = useAuthContext();
    const { restaurant, price, basketDishes, basket, clearBasket } = useBasketContext();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (dbUser) {
                try {
                    const ordersQuery = query(collection(db, "orders"), where("userId", "==", dbUser.id));
                    const querySnapshot = await getDocs(ordersQuery);
                    const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(fetchedOrders);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            }
        };

        fetchOrders();
    }, [dbUser]);

    const createOrder = async () => {
        if (!dbUser || !restaurant || !basket) {
            console.error("Missing dbUser, restaurant, or basket data");
            return;
        }

        try {
            const orderData = {
                userId: dbUser.id,
                restaurant: restaurant,
                status: 'NEW',
                totalPrice: price + (restaurant.deliveryFee || 0),
            };

            const orderDocRef = await addDoc(collection(db, "orders"), orderData);

            const orderDishesPromises = basketDishes.map(basketDish =>
                addDoc(collection(db, "OrderDish"), {
                    quantity: basketDish.quantity,
                    orderId: orderDocRef.id,
                    dish: basketDish.dish
                }).catch(err => {
                    console.error("Failed to create OrderDish:", err);
                    throw err;
                })
            );

            await Promise.all(orderDishesPromises);

            const basketDishQuery = query(collection(db, "basketDish"), where("basketId", "==", basket.id));
            const basketDishSnapshot = await getDocs(basketDishQuery);

            if (!basketDishSnapshot.empty) {
                const basketDishDeletePromises = basketDishSnapshot.docs.map(dishDoc =>
                    deleteDoc(doc(db, "basketDish", dishDoc.id)).catch(err => {
                        console.error("Failed to delete BasketDish:", err);
                        throw err;
                    })
                );
                await Promise.all(basketDishDeletePromises);
                console.log("BasketDish documents deleted successfully.");
            }

            await deleteDoc(doc(db, "basket", basket.id));
            console.log("Basket document deleted successfully.");

            setOrders(prevOrders => [...prevOrders, { ...orderData, id: orderDocRef.id }]);

            clearBasket();
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
                const orderData = { id: orderSnapshot.id, ...orderSnapshot.data() };

                const orderDishesQuery = query(collection(db, "OrderDish"), where("orderId", "==", id));
                const dishesSnapshot = await getDocs(orderDishesQuery);
                const orderDishes = dishesSnapshot.docs.map(dishDoc => ({
                    id: dishDoc.id, ...dishDoc.data()
                }));

                return { ...orderData, dishes: orderDishes };
            } else {
                console.log("No order found with ID:", id);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch order:", error);
            throw error;
        }
    };

    return (
        <OrderContext.Provider value={{ createOrder, orders, getOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);