import { db } from './config'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// Fetch all restaurants
export const fetchRestaurants = async () => {
  try {
    const restaurantsCol = collection(db, 'restaurants');
    const restaurantSnapshot = await getDocs(restaurantsCol);
    const restaurantList = restaurantSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return restaurantList;
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return [];
  }
};


// Fetch dishes for a specific restaurant
export const fetchDishes = async (restaurantId) => {
  try {
    const dishesQuery = query(collection(db, "dishes"), where("restaurantId", "==", restaurantId));
    const dishesSnapshot = await getDocs(dishesQuery);
    const dishesList = dishesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return dishesList;
  } catch (error) {
    console.error("Failed to fetch dishes:", error);
    return [];
  }
};

export const fetchDish = async (dishId) => {
  try {
    const dishDocRef = doc(db, "dishes", dishId);
    const dishDoc = await getDoc(dishDocRef);
    if (dishDoc.exists()) {
      return { id: dishDoc.id, ...dishDoc.data() };
    } else {
      console.log("No such dish exists!");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch dish:", error);
    throw error;
  }
};