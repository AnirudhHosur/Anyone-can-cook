import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OrderDetails from '../screens/OrderDetailsScreen';
import OrderLiveUpdates from '../screens/OrderLiveUpdates.js';

const Tab = createMaterialTopTabNavigator();

const OrderDetailsNavigator = ({ route }) => {
    const id = route?.params?.id;

    return (
        <Tab.Navigator>
            <Tab.Screen name="Details">
                {() => <OrderDetails id={id} />}
            </Tab.Screen>
            <Tab.Screen name="Updates">
                {() => <OrderLiveUpdates id={id} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default OrderDetailsNavigator;