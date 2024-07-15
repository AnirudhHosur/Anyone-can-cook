import { Form, Input, Button, Card, InputNumber, message } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreateMenuItem = () => {
    return (
        <Card title="New Menu Item" style={{ margin: 20 }}>
            <Form
                layout="vertical"
                wrapperCol={{ span: 8 }}
            //onFinish={onFinish}
            //onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Dish Name"
                    name="name"
                    rules={[{ required: true }]}
                    required
                >
                    <Input placeholder="Enter dish name" />
                </Form.Item>
                <Form.Item
                    label="Dish Description"
                    name="description"
                    rules={[{ required: true }]}
                    required
                >
                    <TextArea rows={4} placeholder="Enter dish description" />
                </Form.Item>
                <Form.Item
                    label="Price ($)"
                    name="price"
                    rules={[{ required: true }]}
                    required
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default CreateMenuItem;