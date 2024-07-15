import { useState, useEffect } from "react";
import { Card, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import orders from "../../assets/data/orders.json";

const OrderHistory = () => {

    const OrderStatus = {
        PICKED_UP: "Picked Up",
        COMPLETED: "Completed",
        DECLINED_BY_RESTAURANT: "Declined",
        ACCEPTED: "Accepted",
        PENDING: "Pending",
    };

    const navigate = useNavigate();

    const renderOrderStatus = (orderStatus) => {
        const statusToColor = {
            [OrderStatus.PICKED_UP]: "orange",
            [OrderStatus.COMPLETED]: "green",
            [OrderStatus.DECLINED_BY_RESTAURANT]: "red",
            [OrderStatus.ACCEPTED]: "blue",
            [OrderStatus.PENDING]: "gold",
        };

        return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>;
    };

    const tableColumns = [
        {
            title: "Order ID",
            dataIndex: "orderID",
            key: "orderID",
        },
        {
            title: "Created at",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price?.toFixed(2) ?? 0} $`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: renderOrderStatus,
        },
    ];

    return (
        <Card title={"History Orders"} style={{ margin: 20 }}>
            <Table
                dataSource={orders}
                columns={tableColumns}
                rowKey="orderID"
                onRow={(orderItem) => ({
                    onClick: () => navigate(`/order/${orderItem.orderID}`),
                })}
            />
        </Card>
    )
}

export default OrderHistory;