import { StyleSheet, Text, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, NotoSansThai_500Medium } from '@expo-google-fonts/noto-sans-thai';
import AppLoading from 'expo-app-loading';

export default function Credit() {

     const [ fontsLoaded ] = useFonts({
          NotoSansThai_500Medium,
     });

     if ( !fontsLoaded ) {
          return null;

     } else {
          return (

               <View style={styles.container}>
                    <Text style={styles.header}>โดย</Text>
                    <Text style={styles.message}>นายนภสินธุ์ ต่อศิริสกุลวงศ์</Text>
                    <Text style={styles.message}>นางสาววรรณรดา เหรียญบริสุทธิ์</Text>
                    <Text style={styles.message}>นายติรวิชญ์ เกษมไชยานันท์</Text>
                    <Text style={styles.message}>นายนิรุช จันทะคาม</Text>
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
          fontFamily: "NotoSansThai_500Medium",
     },
     
     message: {
          fontFamily: "NotoSansThai_500Medium",
          fontSize: 18
     },

     header: {
          fontFamily: "NotoSansThai_500Medium",
          fontSize: 22
     }
});