import { StyleSheet, Text, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, NotoSansThai_500Medium } from '@expo-google-fonts/noto-sans-thai';
import AppLoading from 'expo-app-loading';
import { useEffect } from 'react';

export default function SignOut( { navigation } ) {

     const [ fontsLoaded ] = useFonts({
          NotoSansThai_500Medium,
     });

     const removeToken = async ( value ) => {
          try {
               await AsyncStorage.setItem('token', value);
          } catch ( error ) {
               Alert.alert( 'Error: ' + error.message , 'Invalid to remove token.');
          }
     };

     useEffect( () => {
          removeToken( '' );
          new Promise((resolve) => {
               setTimeout(resolve, 2000);
          })
          .then( () => {
               navigation.navigate('sign-in');
          });
     }, []);

     if ( !fontsLoaded ) {
          return null;

     } else {

          return (

               <View style={styles.container}>
                    <Text style={styles.message}>Signing Out ...</Text>
                    <Text style={styles.message}>Return to SignIn</Text>
                    <StatusBar style='auto'/>
               </View>
          );
     }
     
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
     },

     message: {
          fontFamily: "NotoSansThai_500Medium",
          fontSize: 18
     }
});