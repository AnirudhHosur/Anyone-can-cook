import React, { useEffect, useState } from "react";
import { Form, Input, Card, Button, message } from "antd";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const Settings = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState(null);
    const [coordinates, setCoordinates] = useState(null);

    const getAddressLatLng = async (address) => {
        setAddress(address);
        const geocodedByAddress = await geocodeByAddress(address.label);
        const latLng = await getLatLng(geocodedByAddress[0]);
        setCoordinates(latLng);
    };

    const onSubmit = async () => {
        if (!name || !address) {
            message.error("Please provide both name and address.");
            return;
        }

        try {
            const results = await geocodeByAddress(address.label);
            const latLng = await getLatLng(results[0]);
            setCoordinates(latLng);
            message.success("Address submitted successfully!");
        } catch (error) {
            console.error("Error fetching coordinates: ", error);
            message.error("Failed to fetch coordinates.");
        }
    };

    return (
        <Card title="Restaurant Details" style={{ margin: 20 }}>
            <Form layout="vertical" wrapperCol={{ span: 8 }} onFinish={onSubmit}>
                <Form.Item label="Restaurant Name" required>
                    <Input
                        placeholder="Enter restaurant name here"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Restaurant Address" required>
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyDqs71eQm4pVQJTXptIcn_LrNbrf-TRF5A"
                        selectProps={{
                            value: address,
                            onChange: getAddressLatLng,
                            placeholder: "Search for an address...",
                        }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <span>
                {coordinates?.lat} - {coordinates?.lng}
            </span>
        </Card>
    );
};

export default Settings;