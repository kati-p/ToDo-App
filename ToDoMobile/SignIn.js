import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, NotoSansThai_500Medium } from '@expo-google-fonts/noto-sans-thai';
import AppLoading from 'expo-app-loading';
import { Icon } from '@rneui/base';
import { Snackbar } from 'react-native-paper';


export default function SignIn( { navigation } ) {

     const [ id, setId ] = useState('');
     const [ password, setPassword ] = useState('');
     const [ isOpenEye, setIsOpenEye ] = useState(true);
     //const [ token , setToken ] = useState('');
     
     // snackbar
     const [ snackBarOpen, setSnackBarOpen] = useState(false);
     const [ snackBarMessage, setSnackBarMessage] = useState('Hello World!');

     const [ fontsLoaded ] = useFonts({
          NotoSansThai_500Medium,
     });
     
     const saveToken = async ( value ) => {
          try {
               await AsyncStorage.setItem('token', value);
          } catch ( error ) {
               setSnackBarMessage('Invalid to save token.')
               setSnackBarOpen(true);
               //Alert.alert( 'Error: ' + error.message , 'Invalid to save token.');
          }
     };

     const removeToken = async ( value ) => {
          try {
               await AsyncStorage.setItem('token', value);
          } catch ( error ) {
               setSnackBarMessage('Invalid to remove token.')
               setSnackBarOpen(true);
               //Alert.alert( 'Error: ' + error.message , 'Invalid to remove token.');
          }
     };
     
     const signIn = () => {
          axios.post(
               'https://cache111.com/todoapi/tokens',
               { id: id, password: password },
          ).then( ( res ) => {
               saveToken( res.data.token );
               navigation.navigate('myDrawer');
               setSnackBarMessage('Login Successful !!!')
               setSnackBarOpen(true);
               //Alert.alert( 'Login Successful !!!' );
          }).catch( ( error ) => {
               setSnackBarMessage(error.message);
               setSnackBarOpen(true);
               //Alert.alert( 'Error: ' + error.response.status , error.message );
          });
     };

     const handleOnEye = () => {
          setIsOpenEye( !isOpenEye );
     }

     useEffect( () => {
          removeToken( '' );
          /*const test = async (  ) => {
               const value = await AsyncStorage.getItem('token');
               setToken(value);
          };
          test();
          Alert.alert( token );*/
     }, []);

     if ( !fontsLoaded ) {
          return null;
     } else {
          
          return (

               <View style={styles.container}>
                    <Image 
                         source={ require('./assets/to-do.png') } 
                         style={ { width: 250,height: 250, marginTop: 55, marginBottom: 20 } }/>
                    <TextInput 
                         style={styles.input} 
                         placeholder='เลขประจำตัวประชาชน' 
                         keyboardType='numeric'
                         onChangeText={setId} />
                    <View style={styles.view_password}>
                         <TextInput 
                              placeholder='รหัสผ่าน' 
                              secureTextEntry={isOpenEye} 
                              onChangeText={setPassword} 
                              style={styles.input_password}/>
                         <TouchableOpacity style={styles.eye_button} onPress={handleOnEye}>
                              <Icon name= { isOpenEye ? 'eye-with-line' : 'eye' } 
                                   type='entypo'  
                                   style={styles.eye_icon}/>
                         </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={signIn}>
                         <Text style={styles.text_signIn} > เข้าสู่ระบบ </Text>
                    </TouchableOpacity>
                    <StatusBar style='auto'/>

                    {/* Snack Bar */}
                    <Snackbar
                         visible={snackBarOpen}
                         duration={1000}
                         onDismiss={() => {
                                   setSnackBarOpen(false);
                                   setSnackBarMessage('');
                              }
                         }
                         style={styles.snackbar}
                         action={{
                              label: 'OK',
                              onPress: () => {
                                   setSnackBarOpen(false);
                                   setSnackBarMessage('');
                              },
                         }}>
                         {snackBarMessage}
                    </Snackbar>
               </View>
     )};
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          fontFamily: "NotoSansThai_500Medium"
     },

     input: {
          borderWidth: 1,
          borderRadius: 2,
          padding: 10,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          marginBottom: 10,
          width: 250,
          fontFamily: "NotoSansThai_500Medium"
     },

     input_password: {
          flex: 1,
          fontFamily: "NotoSansThai_500Medium"
     },

     eye_icon: {
          marginLeft: 5
     },

     view_password: {
          borderWidth: 1,
          borderRadius: 2,
          padding: 10,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          marginBottom: 10,
          width: 250,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     
     button: {
          alignSelf: "center",
          backgroundColor: "#DDDDDD",
          padding: 10,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          marginBottom: 10,
          width: 250,
          height: 50,
          justifyContent: 'center',
          alignContent: 'center',
     },

     snackbar: {
          bottom: 10
     },

     text_signIn: {
          textAlign: "center",
          fontFamily: 'NotoSansThai_500Medium'
     }
});