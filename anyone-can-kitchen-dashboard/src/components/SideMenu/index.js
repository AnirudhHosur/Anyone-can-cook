import { Menu, message } from "antd";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/config";

const SideMenu = () => {
    const navigate = useNavigate();

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

    const menuItems = [
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
        {
            key: "settings",
            label: "Settings",
        },
        {
            key: "signOut",
            label: "Sign Out",
            danger: true,
        },
    ];

    return <Menu items={menuItems} onClick={onClick} />;
};

export default SideMenu;