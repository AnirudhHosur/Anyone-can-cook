import { Route, Routes } from "react-router-dom";
import Orders from "../../modules/DetailedOrder/Orders";
import RestaurantMenu from "../../modules/RestaurantMenu";
import CreateMenuItem from "../../modules/CreateMenuItem";
import OrderHistory from "../../modules/OrderHistory";
import DetailedOrder from "../../modules/DetailedOrder";
import Settings from "../../modules/Settings";

const AppRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<Orders />} />
            <Route path="order/:id" element={<DetailedOrder />} />
            <Route path="menu" element={<RestaurantMenu />} />
            <Route path="menu/create" element={<CreateMenuItem />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="settings" element={<Settings />} />
        </Routes>
    )
}

export default AppRoutes;