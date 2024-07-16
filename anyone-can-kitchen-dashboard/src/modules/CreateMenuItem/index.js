import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, InputNumber, message } from "antd";
import { useParams } from "react-router-dom";
import { db } from "../../services/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const { TextArea } = Input;

const CreateMenuItem = () => {
    const { dishId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        const fetchDish = async () => {
            if (!dishId) {
                return;
            }

            try {
                const docRef = doc(db, "dishes", dishId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    form.setFieldsValue({
                        name: docSnap.data().name,
                        description: docSnap.data().description,
                        price: docSnap.data().price,
                    });
                    setInitialValues({
                        name: docSnap.data().name,
                        description: docSnap.data().description,
                        price: docSnap.data().price,
                    });
                }
            } catch (error) {
                console.error("Error fetching dish:", error);
                message.error("Failed to fetch dish");
            }
        };

        fetchDish();
    }, [dishId, form]);

    const onFinish = async (values) => {
        setLoading(true);

        try {
            await updateDoc(doc(db, "dishes", dishId), values);
            message.success("Dish updated successfully");
        } catch (error) {
            console.error("Error updating dish:", error);
            message.error("Failed to update dish");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={initialValues ? "Update Menu Item" : "New Menu Item"} style={{ margin: 20 }}>
            <Form layout="vertical" form={form} initialValues={initialValues} onFinish={onFinish}>
                <Form.Item
                    label="Dish Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter dish name" }]}
                >
                    <Input placeholder="Enter dish name" />
                </Form.Item>
                <Form.Item
                    label="Dish Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter dish description" }]}
                >
                    <TextArea rows={4} placeholder="Enter dish description" />
                </Form.Item>
                <Form.Item
                    label="Price ($)"
                    name="price"
                    rules={[{ required: true, message: "Please enter price" }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? "Update" : "Submit"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateMenuItem;