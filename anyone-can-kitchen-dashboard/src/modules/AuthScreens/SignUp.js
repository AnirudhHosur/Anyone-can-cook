import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/config";
import { useNavigation } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigation();

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            message.success("User registered successfully!");
            navigate("/login")
        } catch (error) {
            console.error("Error signing up:", error);
            message.error(error.message);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Form
                style={{ width: "300px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                layout="vertical"
                onFinish={handleSignUp}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>
                <Form.Item label="Email" required>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item label="Password" required>
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SignUp;