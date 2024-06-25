import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../services/config";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {

    const { dbCourier, authUser } = useContext(AuthContext);
    const [order, setOrder] = useState();
    const [user, setUser] = useState();
    const [dishes, setDishes] = useState([]);

    const acceptOrder = async () => {
        try {
            // Update the order in Firestore
            const orderRef = doc(db, "orders", order.id);
            await setDoc(orderRef, {
                ...order,
                status: "ACCEPTED",
                courier: dbCourier,
            }, { merge: true }); // Merge to update only the fields we need

            // Set the active order
            setOrder({
                ...order,
                status: "ACCEPTED",
                courier: dbCourier,
            });

            console.log("Order accepted successfully");

        } catch (error) {
            console.error("Error accepting order: ", error);
            Alert.alert("Error", "Failed to accept order. Please try again.");
        }
    }

    const pickUpOrder = async () => {
        try {
            // Update the order in Firestore
            const orderRef = doc(db, "orders", order.id);
            await setDoc(orderRef, {
                ...order,
                status: "PICKED_UP",
            }, { merge: true }); // Merge to update only the fields we need

            // Update state
            setOrder({
                ...order,
                status: "PICKED_UP",
            });

            console.log("Order picked up successfully");

        } catch (error) {
            console.error("Error picking up order: ", error);
            Alert.alert("Error", "Failed to pick up order. Please try again.");
        }
    }

    const completeOrder = async () => {
        try {
            // Update the order in Firestore
            const orderRef = doc(db, "orders", order.id);
            await setDoc(orderRef, {
                ...order,
                status: "COMPLETED",
            }, { merge: true }); // Merge to update only the fields we need

            // Update state
            setOrder({
                ...order,
                status: "COMPLETED",
            });

            console.log("Order completed successfully");

        } catch (error) {
            console.error("Error completing order: ", error);
            Alert.alert("Error", "Failed to complete order. Please try again.");
        }
    }

    const fetchOrder = async (id) => {
        if (!id) return;
        try {
            const orderDoc = await getDoc(doc(db, "orders", id));
            if (orderDoc.exists()) {
                setOrder({ id: orderDoc.id, ...orderDoc.data() });
                console.log('Order', order)
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching order: ", error);
        }
    };

    const fetchUser = async () => {
        if (!order) return;
        try {
            const userDoc = await getDoc(doc(db, "users", order.userId));
            if (userDoc.exists()) {
                setUser({ id: userDoc.id, ...userDoc.data() });
                console.log('User', user)
            } else {
                console.log("No such user document!");
            }
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    };

    const fetchDishes = async () => {
        if (!order) return;
        try {
            const q = query(collection(db, "OrderDish"), where("orderId", "==", order.id));
            const querySnapshot = await getDocs(q);
            const dishesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDishes(dishesData);
            console.log('Dishes', dishesData);
        } catch (error) {
            console.error("Error fetching dishes: ", error);
        }
    };

    useEffect(() => {
        if (order) {
            fetchUser();
            fetchDishes();
        }
    }, [order]);

    return (
        <OrderContext.Provider value={{ acceptOrder, order, dishes, user, fetchOrder, pickUpOrder, completeOrder }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);