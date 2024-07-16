import { Card, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/config";
import { useRestaurantContext } from "../../contexts/RestaurantContext";

const Orders = () => {
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
                    where("status", "in", ["NEW", "COOKING", "READY_FOR_PICKUP", "ACCEPTED"])
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
            NEW: "green",
            COOKING: "orange",
            READY_FOR_PICKUP: "red",
            ACCEPTED: "purple",
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
            render: (price) => `$ ${price}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: renderOrderStatus,
        },
    ];

    return (
        <Card title={"Orders"} style={{ margin: 20 }}>
            <Table
                dataSource={ordersData}
                columns={tableColumns}
                rowClassName="custom-row-hover"
                rowKey="orderId"
                onRow={(orderItem) => ({
                    onClick: () => navigate(`order/${orderItem.orderId}`),
                })}
            />
        </Card>
    );
};

export default Orders;