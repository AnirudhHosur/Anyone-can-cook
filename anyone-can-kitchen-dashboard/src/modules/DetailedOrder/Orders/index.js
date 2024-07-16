import { Card, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../services/config";

const Orders = () => {
    const navigate = useNavigate();
    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersCollection = collection(db, "orders");
                const querySnapshot = await getDocs(ordersCollection);
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
    }, []); // Empty dependency array ensures useEffect runs only once on mount

    console.log('Hey', ordersData)

    const renderOrderStatus = (orderStatus) => {
        const statusToColor = {
          ["NEW"]: "green",
          ["COOKING"]: "orange",
          ["READY_FOR_PICKUP"]: "red",
          ["ACCEPTED"]: "purple",
        };
    
        return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>;
      };

    const tableColumns = [
        {
            title: "Order ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Delivery Address",
            dataIndex: "deliveryAddress",
            key: "deliveryAddress",
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
                rowKey="orderId"
                onRow={(orderItem) => ({
                    onClick: () => navigate(`order/${orderItem.orderId}`),
                })}
            />
        </Card>
    );
};

export default Orders;