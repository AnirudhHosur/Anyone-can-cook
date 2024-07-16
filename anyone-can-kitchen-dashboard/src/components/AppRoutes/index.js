import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../contexts/ProtectedRoutes";
import SignIn from "../../modules/AuthScreens/SignIn";
import SignUp from "../../modules/AuthScreens/SignUp";
import DetailedOrder from "../../modules/DetailedOrder";
import OrderHistory from "../../modules/OrderHistory";
import Orders from "../../modules/Orders";
import RestaurantMenu from "../../modules/RestaurantMenu";
import Settings from "../../modules/Settings";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />
            <Route path="/" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="order/:id" element={<ProtectedRoute><DetailedOrder /></ProtectedRoute>} />
            <Route path="menu" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
            <Route path="order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;