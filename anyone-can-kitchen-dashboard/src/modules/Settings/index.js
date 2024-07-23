import React, { useEffect, useState } from "react";
import { Form, Input, Card, Button, message } from "antd";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/config";
import useAuth from "../../contexts/useAuth";
import { useRestaurantContext } from "../../contexts/RestaurantContext";

const Settings = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const { user } = useAuth();
    const { restaurant, setRestaurant } = useRestaurantContext();

    useEffect(() => {
        if (restaurant) {
            setName(restaurant.name);
            setCoordinates({ lat: restaurant.lat, lng: restaurant.lng });
        }
    }, [restaurant]);

    const getAddressLatLng = async (address) => {
        setAddress(address);
        if (address) {
            try {
                const geocodedByAddress = await geocodeByAddress(address.label);
                const latLng = await getLatLng(geocodedByAddress[0]);
                setCoordinates(latLng);
            } catch (error) {
                console.error("Error fetching coordinates: ", error);
            }
        }
    };

    const onSubmit = async () => {
        if (!restaurant?.id) {
            await createNewRestaurant();
        } else {
            await updateRestaurant();
        }
    };

    const createNewRestaurant = async () => {
        if (!name || !address) {
            message.error("Please provide both name and address.");
            return;
        }

        try {
            const results = await geocodeByAddress(address.label);
            const latLng = await getLatLng(results[0]);
            setCoordinates(latLng);

            const newRestaurant = {
                name,
                address: address.label,
                lat: latLng.lat,
                lng: latLng.lng,
                deliveryFee: 0,
                minDeliveryTime: 10,
                maxDeliveryTime: 25,
                image: "https://media.cntraveler.com/photos/654bd5e13892537a8ded0947/16:9/w_2560%2Cc_limit/phy2023.din.oss.restaurant-lr.jpg",
                adminSub: user?.uid,
                rating: "4",
            };

            const docRef = await addDoc(collection(db, "restaurants"), newRestaurant);
            const docId = docRef.id;

            console.log("Restaurant ID:", docId);

            const newRestaurantWithId = { ...newRestaurant, id: docId };
            setRestaurant(newRestaurantWithId);

            setName("");
            setAddress(null);
            setCoordinates(null);
            message.success("Restaurant saved successfully!");

        } catch (error) {
            console.error("Error fetching coordinates or saving data: ", error);
            message.error("Failed to save restaurant data.");
        }
    };

    const updateRestaurant = async () => {
        if (!name && !address) {
            message.error("Please provide either a valid name or address.");
            return;
        }

        try {
            const updatedData = {};

            if (name) {
                updatedData.name = name;
            }

            if (address && coordinates) {
                updatedData.address = address.label;
                updatedData.lat = coordinates.lat;
                updatedData.lng = coordinates.lng;
            }

            if (!restaurant.id) {
                message.error("Invalid restaurant ID.");
                return;
            }

            const restaurantDocRef = doc(db, "restaurants", restaurant.id);
            await updateDoc(restaurantDocRef, updatedData);

            setRestaurant({ ...restaurant, ...updatedData });

            message.success("Restaurant updated successfully!");

        } catch (error) {
            console.error("Error updating restaurant data: ", error);
            message.error("Failed to update restaurant data.");
        }
    };

    return (
        <Card title="Restaurant Details" style={{ margin: 20 }}>
            <Form layout="vertical" wrapperCol={{ span: 8 }} onFinish={onSubmit}>
                <Form.Item label="Restaurant Name">
                    <Input
                        placeholder="Enter restaurant name here"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Restaurant Address">
                    <GooglePlacesAutocomplete
                        apiKey={process.env.REACT_APP_GOOGLE_MAPS_AUTOCOMPLETE_API_KEY}
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
            <h3>Your co-ordinates</h3>
            <span>
                {coordinates?.lat} - {coordinates?.lng}
            </span>
        </Card>
    );
};

export default Settings;