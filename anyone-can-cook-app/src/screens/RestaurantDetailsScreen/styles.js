import { StyleSheet } from "react-native";

export default StyleSheet.create({
    page: {
        flex: 1
    },

    container: {
        margin: 10
    },

    image: {
        width: '100%',
        aspectRatio: 5 / 3
    },

    iconContainer: {
        position: 'absolute',
        top: 40,
        left: 10
    },

    title: {
        fontSize: 35,
        fontWeight: '600',
        marginVertical: 10,
    },

    subtitle: {
        color: 'grey',
        fontSize: 15
    },

    menuTitle: {
        marginTop: 20,
        fontSize: 18,
        letterSpacing: 0.7
    },

    button: {
        backgroundColor: 'black',
        marginTop: 'auto',
        padding: 20,
        alignItems: 'center',
        margin: 10
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20
    }
});