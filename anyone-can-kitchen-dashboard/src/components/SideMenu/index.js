import { Menu, message } from "antd";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/config";
import { useRestaurantContext } from "../../contexts/RestaurantContext";

const SideMenu = () => {
    const navigate = useNavigate();
    const { restaurant } = useRestaurantContext()

    const onClick = async (menuItem) => {
        if (menuItem.key === "signOut") {
            try {
                await signOut(auth);
                message.success("Signed out successfully.");
                window.location.reload();
            } catch (error) {
                console.error("Error signing out:", error);
                message.error("Failed to sign out.");
            }
        } else {
            navigate(menuItem.key);
        }
    };

    const mainMenuItems = [
        {
            key: "/",
            label: "Orders",
        },
        {
            key: "menu",
            label: "Menu",
        },
        {
            key: "order-history",
            label: "Order History",
        },
    ];

    const menuItems = [
        ...(restaurant ? mainMenuItems : []),
        {
            key: "settings",
            label: "Settings",
        },
        {
            key: "signOut",
            label: "Sign out",
            danger: "true",
        },
    ];

    return (
        <>
            {restaurant && <h4>{restaurant.name}</h4>}
            <Menu items={menuItems} onClick={onClick} />
        </>
    )
};

export default SideMenu;