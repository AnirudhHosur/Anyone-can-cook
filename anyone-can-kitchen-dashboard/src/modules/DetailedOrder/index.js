import { Button, Card, Descriptions, Divider, List, Avatar, Tag } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/config";

const DetailedOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderDocRef = doc(db, "orders", id);
                const orderDoc = await getDoc(orderDocRef);
                if (orderDoc.exists()) {
                    setOrder(orderDoc.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (order && order.userId) {
                try {
                    const userDocRef = doc(db, "users", order.userId);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setCustomer(userDoc.data());
                    } else {
                        console.log("No such user!");
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        fetchCustomer();
    }, [order]);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const orderDishCollection = collection(db, "OrderDish");
                const q = query(orderDishCollection, where("orderId", "==", id));
                const querySnapshot = await getDocs(q);
                const fetchedDishes = [];
                querySnapshot.forEach((doc) => {
                    fetchedDishes.push(doc.data());
                });
                setDishes(fetchedDishes);
            } catch (error) {
                console.error("Error fetching dishes:", error);
            }
        };

        fetchDishes();
    }, [id]);

    const updateOrderStatus = async (newStatus) => {
        try {
            const orderDocRef = doc(db, "orders", id);
            await updateDoc(orderDocRef, { status: newStatus });
            setOrder((prevOrder) => ({
                ...prevOrder,
                status: newStatus,
            }));
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const renderActionButtons = () => {
        switch (order?.status) {
            case "NEW":
                return (
                    <>
                        <Button block type="primary" danger style={styles.button} onClick={() => updateOrderStatus("DECLINED")}>
                            Decline Order
                        </Button>
                        <Button block type="primary" style={styles.button} onClick={() => updateOrderStatus("COOKING")}>
                            Accept Order
                        </Button>
                    </>
                );
            case "COOKING":
                return (
                    <Button block type="primary" onClick={() => updateOrderStatus("READY_FOR_PICKUP")}>
                        Food is Done
                    </Button>
                );
            default:
                return null;
        }
    };

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <Card title={<Tag color={statusToColor[order.status]}>{`${order.status} Order`}</Tag>} style={{ margin: 20 }}>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Customer">
                    {customer ? customer.firstName : "Loading..."}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Address">
                    {customer ? customer.address : "Loading..."}
                </Descriptions.Item>
            </Descriptions>
            <Divider />

            <List
                itemLayout="horizontal"
                dataSource={dishes}
                renderItem={(dishItem) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={dishItem.dish.image} size={128} style={styles.avatar} />}
                            title={
                                <div style={styles.leftContainer}>
                                    <div style={styles.dishName}>{dishItem.dish.name}</div>
                                    <div style={styles.dishDescription}>{dishItem.dish.shortDescription}</div>
                                </div>
                            }
                        />
                        <div style={styles.rightContainer}>
                            <div style={styles.price}>${dishItem.dish.price}</div>
                            <div style={styles.quantity}>Quantity: {dishItem.quantity}</div>
                        </div>
                    </List.Item>
                )}
                style={styles.list}
            />
            <Divider />

            <div style={styles.totalSumContainer}>
                <h2>Total: </h2>
                <h2 style={styles.totalPrice}>${order?.totalPrice}</h2>
            </div>
            <Divider />

            <div style={styles.buttonsContainer}>
                {renderActionButtons()}
            </div>
        </Card>
    );
};

const statusToColor = {
    NEW: "green",
    COOKING: "orange",
    READY_FOR_PICKUP: "red",
    ACCEPTED: "purple",
};

const styles = {
    avatar: {
        marginRight: 16,
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    dishName: {
        fontWeight: 'bold',
        fontSize: '1.2em',
    },
    dishDescription: {
        color: 'gray',
    },
    rightContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginLeft: 'auto',
    },
    price: {
        fontWeight: 'bold',
        fontSize: '1.2em',
    },
    quantity: {
        marginTop: 8,
    },
    totalSumContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    totalPrice: {
        marginLeft: 'auto',
        fontWeight: 'bold',
    },
    buttonsContainer: {
        display: 'flex',
        paddingBottom: 30,
    },
    button: {
        marginRight: 30,
        marginLeft: 20,
    },
};

export default DetailedOrder;