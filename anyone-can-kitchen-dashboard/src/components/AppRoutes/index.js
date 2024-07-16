import { Route, Routes } from "react-router-dom";
import Orders from "../../modules/DetailedOrder/Orders";
import RestaurantMenu from "../../modules/RestaurantMenu";
import CreateMenuItem from "../../modules/CreateMenuItem";
import OrderHistory from "../../modules/OrderHistory";
import DetailedOrder from "../../modules/DetailedOrder";
import Settings from "../../modules/Settings";
import SignUp from "../../modules/AuthScreens/SignUp";
import SignIn from "../../modules/AuthScreens/SignIn";
import ProtectedRoute from "../../contexts/ProtectedRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />
            <Route path="/" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="order/:id" element={<ProtectedRoute><DetailedOrder /></ProtectedRoute>} />
            <Route path="menu" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
            <Route path="menu/create" element={<ProtectedRoute><CreateMenuItem /></ProtectedRoute>} />
            <Route path="order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;