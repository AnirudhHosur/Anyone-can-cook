import React, { useState, useEffect } from "react";
import { Card, Table, Button, Popconfirm, message, Modal, Form, Input, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "../../services/config";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { useRestaurantContext } from "../../contexts/RestaurantContext";

const RestaurantMenu = () => {
    const { restaurantDocRefId } = useRestaurantContext();
    const [dishes, setDishes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(""); // "create" or "update"
    const [initialValues, setInitialValues] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDishes = async () => {
            if (!restaurantDocRefId) {
                return;
            }

            try {
                const q = query(collection(db, "dishes"), where("restaurantId", "==", restaurantDocRefId));
                const querySnapshot = await getDocs(q);

                const fetchedDishes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setDishes(fetchedDishes);
            } catch (error) {
                console.error("Error fetching dishes:", error);
                message.error("Failed to fetch dishes");
            }
        };

        fetchDishes();
    }, [restaurantDocRefId]);

    const handleDelete = async (item) => {
        try {
            await deleteDoc(doc(db, "dishes", item.id));
            setDishes(prevDishes => prevDishes.filter(dish => dish.id !== item.id));
            message.success("Dish deleted successfully");
        } catch (error) {
            console.error("Error deleting dish:", error);
            message.error("Failed to delete dish");
        }
    };

    const handleModalOpen = (type, initialValues) => {
        setModalType(type);
        setInitialValues(initialValues || {});
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setModalType("");
        setInitialValues(null);
        form.resetFields();
    };

    const handleFormSubmit = async (values) => {
        try {
            if (modalType === "create") {
                const newDocRef = await addDoc(collection(db, "dishes"), {
                    ...values,
                    restaurantId: restaurantDocRefId,
                });
                setDishes(prevDishes => [...prevDishes, { id: newDocRef.id, ...values }]);
                message.success("Dish created successfully");
            } else if (modalType === "update") {
                await updateDoc(doc(db, "dishes", initialValues.id), values);
                setDishes(prevDishes =>
                    prevDishes.map(dish =>
                        dish.id === initialValues.id ? { ...dish, ...values } : dish
                    )
                );
                message.success("Dish updated successfully");
            }
            handleModalClose();
        } catch (error) {
            console.error("Error:", error);
            message.error(`Failed to ${modalType === "create" ? "create" : "update"} dish`);
        }
    };

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
                <>
                    <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => handleModalOpen("update", item)}
                    >
                        Update
                    </Button>
                    <Popconfirm
                        placement="topLeft"
                        title={"Are you sure you want to delete this dish?"}
                        onConfirm={() => handleDelete(item)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Remove</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const renderNewItemButton = () => (
        <Button type="primary" onClick={() => handleModalOpen("create")}>
            <PlusOutlined /> New Item
        </Button>
    );

    return (
        <Card title={"Menu"} style={{ margin: 20 }} extra={renderNewItemButton()}>
            <Table dataSource={dishes} columns={tableColumns} rowKey="id" />

            <Modal
                title={modalType === "create" ? "New Menu Item" : "Update Menu Item"}
                open={modalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="cancel" onClick={handleModalClose}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                        loading={false} // Add loading state if necessary
                    >
                        {modalType === "create" ? "Create" : "Update"}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Dish Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter dish name" }]}
                    >
                        <Input placeholder="Enter dish name" />
                    </Form.Item>
                    <Form.Item
                        label="Short Description"
                        name="shortDescription"
                        rules={[{ required: true, message: "Please enter dish description" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter dish description" />
                    </Form.Item>
                    <Form.Item
                        label="Price ($)"
                        name="price"
                        rules={[{ required: true, message: "Please enter price" }]}
                    >
                        <InputNumber style={{ width: "100%" }} placeholder="Enter price" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default RestaurantMenu;