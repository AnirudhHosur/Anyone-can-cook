import { Entypo } from '@expo/vector-icons';
import { View } from "react-native";
import { Marker } from 'react-native-maps';

const CustomMarker = ({data, type}) => {

    if (!data) {
        console.log('Data is undefined or null:', data);
        return null; // Don't render if data is undefined or null
    }

    return (
        <Marker
            coordinate={{ latitude: data.lat, longitude: data.lng }}
            title={data.name}
            description={data.address}
        >
            <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                {
                    type === "RESTAURANT" ? <Entypo name="shop" size={24} color="white" />
                        : (
                            <Entypo name="bowl" size={24} color="white" />
                        )
                }
            </View>
        </Marker>
    )
}

export default CustomMarker;