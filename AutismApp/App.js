import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-web';

export default function App() {
    return(
        <View style={styles.container}>
            <Text>Open up App.js to start working on your App</Text>
            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f90303ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});