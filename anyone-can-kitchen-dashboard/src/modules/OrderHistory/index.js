import { useState, useEffect } from "react";
import { Card, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/config";
import { useRestaurantContext } from "../../contexts/RestaurantContext";

const OrderHistory = () => {
    const navigate = useNavigate();
    const [ordersData, setOrdersData] = useState([]);
    const { restaurantDocRefId } = useRestaurantContext();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!restaurantDocRefId) {
                console.warn('Restaurant.id is not defined');
                return;
            }

            try {
                const ordersCollection = collection(db, "orders");
                const q = query(
                    ordersCollection,
                    where("restaurant.id", "==", restaurantDocRefId),
                    where("status", "in", ["PICKED_UP", "COMPLETED", "DECLINED"])
                );
                const querySnapshot = await getDocs(q);
                const fetchedOrders = [];
                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ ...doc.data(), orderId: doc.id });
                });
                setOrdersData(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [restaurantDocRefId]);

    const renderOrderStatus = (orderStatus) => {
        const statusToColor = {
            PICKED_UP: "orange",
            COMPLETED: "green",
            DECLINED_BY_RESTAURANT: "red",
            ACCEPTED: "blue",
        };

        return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>;
    };

    const tableColumns = [
        {
            title: "Order ID",
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `$ ${price?.toFixed(2) ?? 0}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: renderOrderStatus,
        },
    ];

    return (
        <Card title={"Order History"} style={{ margin: 20 }}>
            <Table
                dataSource={ordersData}
                columns={tableColumns}
                rowKey="orderId"
                onRow={(orderItem) => ({
                    onClick: () => navigate(`/order/${orderItem.orderId}`),
                })}
            />
        </Card>
    );
};

export default OrderHistory;