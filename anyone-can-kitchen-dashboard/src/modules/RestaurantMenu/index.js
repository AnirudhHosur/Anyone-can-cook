import dishes from "../../assets/data/dishes.json"
import { Card, Table, Button, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RestaurantMenu = () => {

    //const [dishes, setDishes] = useState([]);

    const tableColumns = [
        {
            title: "Menu Item",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price} $`,
        },
        {
            title: "Action",
            key: "action",
            render: (_, item) => (
                <Popconfirm
                    placement="topLeft"
                    title={"Are you sure you want to delete this dish?"}
                    //onConfirm={() => deleteDish(item)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger>Remove</Button>
                </Popconfirm>
            ),
        },
    ];

    const renderNewItemButton = () => (
        <Link to={"create"}>
            <Button type="primary">New Item</Button>
        </Link>
    );

    return (
        <Card title={"Menu"} style={{ margin: 20 }} extra={renderNewItemButton()}
        >
            <Table dataSource={dishes} columns={tableColumns} rowKey="id" />
        </Card>
    )
}

export default RestaurantMenu;