import { Alert, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback ,Modal, Pressable, TextInput} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, NotoSansThai_500Medium } from '@expo-google-fonts/noto-sans-thai';
import AppLoading from 'expo-app-loading';
import { DataTable, shadow, Snackbar } from 'react-native-paper';
import moment from 'moment';
import { Icon } from '@rneui/base';
import DateTimePicker from '@react-native-community/datetimepicker'
import { BlurView } from 'expo-blur';

export default function Main( { navigation } ) {
     
     const [ token, setToken ] = useState('');
     const [ data, setData ] = useState([]);      // activities data
     const [ isCreateOpen, setIsCreateOpen ] = useState(false);

     // snackbar
     const [ snackBarOpen, setSnackBarOpen] = useState(false);
     const [ snackBarMessage, setSnackBarMessage] = useState('Hello World!');
     
     // form variables
     const [ showDatePicker, setShowDatePicker] = useState(false);
     const [ showTimePicker, setShowTimePicker] = useState(false);
     const [ activityName, setActivityName ] = useState('');
     const [ dateTime , setDateTime ] = useState(new Date());

     // thai format date time https://momentjs.com/
     const formatToThaiDateTime = ( dateTime ) => {
          const date = moment(dateTime);
          const year = date.year() + 543;  // Convert CE to BE
          return `${date.format('D MMM')} ${year} เวลา ${date.format('HH:mm')} น`;
     };
     // to fetch date time to right by +GWT
     const formatToDateTime = () => {
          const offsetMS = dateTime.getTimezoneOffset() * 60 * 1000;
          const date = new Date(dateTime.getTime() - offsetMS);
          return date.toJSON().slice(0, 16);
     };
     const formatDate = ( dateTime ) => {
          const date = moment(dateTime);
          const year = date.year() + 543;  // Convert CE to BE
          return `${date.format('D MMM')} ${year}`;
     }
     const formatTime = ( dateTime ) => {
          const date = moment(dateTime);
          const year = date.year() + 543;  // Convert CE to BE
          return `เวลา ${date.format('HH:mm')} น`;
     }
     // fetch by attach token to get activities data
     useEffect( () => {
          const getToken = async () => {
               const value = await AsyncStorage.getItem('token');
               setToken(value);
          };
          getToken();
     }, []);
     // do this because "useEffect" is not await you
     useEffect( () => {
          if ( token ) {
               axios.get(
                    'https://cache111.com/todoapi/activities',
                    { headers: { Authorization: 'Bearer ' + token }, timeout: 10 * 1000},
               ).then( ( res ) => {
                    setData( res.data );
                    setSnackBarMessage('Login Successful !!!')
                    setSnackBarOpen(true);
               }).catch( ( error ) => {
                    setSnackBarMessage(error.message)
                    setSnackBarOpen(true);
                    Alert.alert( 'Error: ' + error.response.status , error.message );
               });
          }
     }, [token])
     
     // create activity
     const popUpCreate = () => {
          setIsCreateOpen(true)
          setActivityName('');
          setDateTime(new Date());
     }

     const createActivity = () => {
          setIsCreateOpen(false);
          if (activityName === ''){
               setSnackBarMessage("Please Enter activity's name.")
               setSnackBarOpen(true);
               return;
          }
          axios.post(
               'https://cache111.com/todoapi/activities',
               { name: activityName, when: formatToDateTime() },
               { headers: { Authorization: 'Bearer ' + token }, timeout: 10 * 1000},
          ).then( (response) => {
               const newData = {
                    id: response.data.id,
                    name: activityName, 
                    when: dateTime
               };
               setData([...data, newData]);
               setSnackBarMessage('Create Activity Successful !!!')
               setSnackBarOpen(true);
          }).catch( (error) => {
               setSnackBarMessage(error.message)
               setSnackBarOpen(true);
               Alert.alert( 'Error: ' + error.status , error.message );
          });
          
     }

     const [ isEditOpen, setIsEditOpen ] = useState(false);
     const [ editId , setEditId] = useState(null)
     // edit activity
     const popUpEditActivity = ( id ) => {
          const index = data.map( a => a.id ).indexOf(id);
          const actname = data[index].name;
          const date = new Date(data[index].when);
          setActivityName(actname);
          setDateTime(date);
          setIsEditOpen(true);
          setEditId(id);
     }

     const editActivity = () => {
          setIsEditOpen(false);
          if (editId == null) return;
          if (activityName === ''){
               setSnackBarMessage("Please Enter activity's name.")
               setSnackBarOpen(true);
               return;
          }
          axios.put(
               `https://cache111.com/todoapi/activities/${editId}`,
               { name: activityName, when: formatToDateTime() },
               { headers: { Authorization: 'Bearer ' + token }, timeout: 10 * 1000},
          ).then( (response) => {
               const newData = {
                    id: editId,
                    name: activityName, 
                    when: dateTime
               };
               const editedData = [...data];
               const index = data.map( a => a.id ).indexOf(editId);
               editedData[index] = newData
               setData([...editedData]);
               setSnackBarMessage('Update Activity Successful !!!')
               setSnackBarOpen(true);
          }).catch( (error) => {
               setSnackBarMessage(error.message)
               setSnackBarOpen(true);
               Alert.alert( 'Error: ' + error.status , error.message );
          }).finally( () => {
               setEditId(null);
          });
     }

     // delete activity
     const [ callDeletePopUp , setCallDeletePopUp ] = useState(false);
     const [ deleteId, setDeleteId ] = useState(null);
     
     const popUpDelete = ( id ) => {
          setCallDeletePopUp(true);
          setDeleteId(id);
     }

     const deleteActivity = () => {
          if (deleteId == null) return;
          axios.delete(
               `https://cache111.com/todoapi/activities/${deleteId}`,
               { headers: { Authorization: 'Bearer ' + token }, timeout: 10 * 1000},
          ).then( (response) => {
               const deleteData = [...data];
               const index = data.map( a => a.id ).indexOf(deleteId);
               deleteData.splice(index, 1);
               setData([...deleteData]);
               setSnackBarMessage('Delete Activity Successful !!!')
               setSnackBarOpen(true);
          }).catch( (error) => {
               setSnackBarMessage(error.message)
               setSnackBarOpen(true);
               Alert.alert( 'Error: ' + error.status , error.message );
          }).finally( () => {
               setDeleteId(null);
          });
          
     }

     const [ fontsLoaded ] = useFonts({
          NotoSansThai_500Medium,
     });
     
     // for TableData https://callstack.github.io/react-native-paper/docs/components/DataTable/
     const [ page, setPage ] = useState(0);
     const [ numberOfItemsPerPageList ] = useState([2, 3, 4, 5, 6, 7, 8]);
     const [ itemsPerPage, onItemsPerPageChange ] = useState(
          numberOfItemsPerPageList[6]
     );
     const from = page * itemsPerPage;
     const to = Math.min((page + 1) * itemsPerPage, data.length);
     useEffect( () => {
          setPage(0);
     }, [ itemsPerPage ]);


     if ( !fontsLoaded ) {
          return null;
     } else {
          
          return (
               
               <BlurView 
                    intensity={(isCreateOpen || callDeletePopUp || isEditOpen)? 90 : 0} 
                    tint={(isCreateOpen || callDeletePopUp || isEditOpen)? "dark": "light"} 
                    style={styles.container}>
                    <View style={styles.table_body}>
                         <DataTable>
                              <DataTable.Header>
                                   <DataTable.Title><Text style={styles.text_header}>กิจกรรม</Text></DataTable.Title>
                                   <DataTable.Title numeric><Text style={styles.text_header}>วัน/เวลา</Text></DataTable.Title>
                                   <DataTable.Title numeric><Text style={styles.text_header}>แก้ไข</Text></DataTable.Title>
                              </DataTable.Header>
                              {data.slice(from, to).map((item) => (
                                   <DataTable.Row key={item.id}>
                                        <DataTable.Cell ><Text style={styles.text}>{ item.name }</Text></DataTable.Cell>
                                        <DataTable.Cell ><Text style={styles.text}>{ formatToThaiDateTime(item.when) }</Text></DataTable.Cell>
                                        <DataTable.Cell numeric>
                                             <View style={styles.edit_box}>
                                                  <TouchableOpacity onPress={() => {popUpEditActivity(item.id)}}>
                                                       <Icon 
                                                            name='pencil' 
                                                            type='font-awesome' 
                                                            style={styles.edit_button}/>
                                                  </TouchableOpacity>
                                                  <TouchableOpacity onPress={() => {popUpDelete(item.id)}}>
                                                       <Icon 
                                                            name='trash' 
                                                            type='font-awesome-5'
                                                            style={styles.edit_button}/>
                                                  </TouchableOpacity>
                                             </View>
                                        </DataTable.Cell>
                                   </DataTable.Row>
                              ))}
                              
                         </DataTable>
                    </View>
                    <View style={styles.plus_activity_button}>
                         <TouchableOpacity onPress={popUpCreate}>
                              <Icon 
                                   name='calendar-plus' 
                                   type='font-awesome-5'/>
                              <Text style={styles.plus_activity_text}>เพิ่มกิจกรรม</Text>
                         </TouchableOpacity>
                    </View>
                    <View style={styles.selection_footer}>
                         <DataTable.Pagination
                              page={page}
                              numberOfPages={Math.ceil(data.length / itemsPerPage)}
                              onPageChange={(page) => setPage(page)}
                              label={`${from + 1}-${to} of ${data.length}`}
                              numberOfItemsPerPageList={numberOfItemsPerPageList}
                              numberOfItemsPerPage={itemsPerPage}
                              onItemsPerPageChange={onItemsPerPageChange}
                              showFastPaginationControls
                              selectPageDropdownLabel={'Rows per page'}/>
                    </View>
               
                    
                    {/* to more clean code, these code should make another component called Form something..*/}
                    {/* use "Modal" for make form  https://reactnative.dev/docs/modal*/}
                    {/* create activity form */}
                    <Modal
                         animationType="slide"
                         transparent={true}
                         visible={isCreateOpen}
                         onRequestClose={() => {
                              setIsCreateOpen(false);
                         }}
                    >    
                         <TouchableOpacity onPress={() => setIsCreateOpen(false)} style={styles.outside_modal}>
                              <TouchableWithoutFeedback>
                                   <View style={styles.inside_modal}>
                                        <Text style={styles.text_header}>เพิ่มกิจกรรม</Text>
                                        <TextInput
                                             value={activityName}
                                             onChangeText={ (text) => setActivityName(text)}
                                             placeholder="ชื่อกิจกรรม"
                                             style={styles.form_input}
                                        />
                                        <View style={styles.pickTime_box}>
                                             <TouchableOpacity 
                                                  onPress={() => setShowDatePicker(true)}
                                                  style={styles.pickTime_button}>
                                                       <Icon 
                                                            name='calendar' 
                                                            type='font-awesome'/>
                                                       <Text style={styles.text_pickTime}>เลือกวันที่:       {formatDate(dateTime)}</Text>
                                             </TouchableOpacity>
                                             {showDatePicker && (
                                                  <DateTimePicker
                                                       value={dateTime}
                                                       mode="date"
                                                       display="default"
                                                       onChange={(e, selectedDate) => {
                                                            setShowDatePicker(false);
                                                            let newDateTime = new Date();
                                                            newDateTime
                                                            .setFullYear(
                                                                 selectedDate.getFullYear(), 
                                                                 selectedDate.getMonth(), 
                                                                 selectedDate.getDate()
                                                            );
                                                            newDateTime
                                                            .setHours(
                                                                 dateTime.getHours(),
                                                                 dateTime.getMinutes(),
                                                                 dateTime.getSeconds(),
                                                                 dateTime.getMilliseconds()
                                                            );
                                                            setDateTime(newDateTime);
                                                       }}
                                                  />
                                             )}

                                             <TouchableOpacity 
                                                  onPress={() => setShowTimePicker(true)}
                                                  style={styles.pickTime_button}>
                                                       <Icon 
                                                            name='clock' 
                                                            type='fontisto'/>
                                                       <Text style={styles.text_pickTime}>เลือกเวลา:      {formatTime(dateTime)}</Text>
                                             </TouchableOpacity>
                                             {showTimePicker && (
                                                  <DateTimePicker
                                                       value={dateTime}
                                                       mode="time"
                                                       display="default"
                                                       onChange={(e, selectedTime) => {
                                                            setShowTimePicker(false);
                                                            let newDateTime = new Date();
                                                            newDateTime
                                                            .setFullYear(
                                                                 dateTime.getFullYear(), 
                                                                 dateTime.getMonth(), 
                                                                 dateTime.getDate()
                                                            );
                                                            newDateTime
                                                            .setHours(
                                                                 selectedTime.getHours(),
                                                                 selectedTime.getMinutes(),
                                                                 selectedTime.getSeconds(),
                                                                 selectedTime.getMilliseconds()
                                                            );
                                                            setDateTime(newDateTime);
                                                       }}
                                                  />
                                             )}
                                        </View>

                                        <Pressable onPress={createActivity} style={styles.submit_form_button}>
                                             <Text style={styles.text_submit}>ยืนยัน</Text>
                                        </Pressable >
                                   </View>
                              </TouchableWithoutFeedback> 
                         </TouchableOpacity>
                    </Modal>

                    {/* edit activity form */}
                    <Modal
                         animationType="slide"
                         transparent={true}
                         visible={isEditOpen}
                         onRequestClose={() => {
                              setIsEditOpen(false);
                         }}
                    >    
                         <TouchableOpacity onPress={() => setIsEditOpen(false)} style={styles.outside_modal}>
                              <TouchableWithoutFeedback>
                                   <View style={styles.inside_modal}>
                                        <Text style={styles.text_header}>แก้ไขกิจกรรม</Text>
                                        <TextInput
                                             value={activityName}
                                             onChangeText={ (text) => setActivityName(text)}
                                             placeholder="ชื่อกิจกรรม"
                                             style={styles.form_input}
                                        />
                                        <View style={styles.pickTime_box}>
                                             <TouchableOpacity 
                                                  onPress={() => setShowDatePicker(true)}
                                                  style={styles.pickTime_button}>
                                                       <Icon 
                                                            name='calendar' 
                                                            type='font-awesome'/>
                                                       <Text style={styles.text_pickTime}>เลือกวันที่:       {formatDate(dateTime)}</Text>
                                             </TouchableOpacity>
                                             {showDatePicker && (
                                                  <DateTimePicker
                                                       value={dateTime}
                                                       mode="date"
                                                       display="default"
                                                       onChange={(e, selectedDate) => {
                                                            setShowDatePicker(false);
                                                            let newDateTime = new Date();
                                                            newDateTime
                                                            .setFullYear(
                                                                 selectedDate.getFullYear(), 
                                                                 selectedDate.getMonth(), 
                                                                 selectedDate.getDate()
                                                            );
                                                            newDateTime
                                                            .setHours(
                                                                 dateTime.getHours(),
                                                                 dateTime.getMinutes(),
                                                                 dateTime.getSeconds(),
                                                                 dateTime.getMilliseconds()
                                                            );
                                                            setDateTime(newDateTime);
                                                       }}
                                                  />
                                             )}

                                             <TouchableOpacity 
                                                  onPress={() => setShowTimePicker(true)}
                                                  style={styles.pickTime_button}>
                                                       <Icon 
                                                            name='clock' 
                                                            type='fontisto'/>
                                                       <Text style={styles.text_pickTime}>เลือกเวลา:      {formatTime(dateTime)}</Text>
                                             </TouchableOpacity>
                                             {showTimePicker && (
                                                  <DateTimePicker
                                                       value={dateTime}
                                                       mode="time"
                                                       display="default"
                                                       onChange={(e, selectedTime) => {
                                                            setShowTimePicker(false);
                                                            let newDateTime = new Date();
                                                            newDateTime
                                                            .setFullYear(
                                                                 dateTime.getFullYear(), 
                                                                 dateTime.getMonth(), 
                                                                 dateTime.getDate()
                                                            );
                                                            newDateTime
                                                            .setHours(
                                                                 selectedTime.getHours(),
                                                                 selectedTime.getMinutes(),
                                                                 selectedTime.getSeconds(),
                                                                 selectedTime.getMilliseconds()
                                                            );
                                                            setDateTime(newDateTime);
                                                       }}
                                                  />
                                             )}
                                        </View>

                                        <Pressable onPress={editActivity} style={styles.submit_form_button}>
                                             <Text style={styles.text_submit}>ยืนยัน</Text>
                                        </Pressable >
                                   </View>
                              </TouchableWithoutFeedback> 
                         </TouchableOpacity>
                    </Modal>

                    {/* sure to delete? */}
                    <Modal
                         animationType="slide"
                         transparent={true}
                         visible={callDeletePopUp}
                         onRequestClose={() => {
                              setCallDeletePopUp(false);
                         }}>
                         <TouchableOpacity onPress={() => setCallDeletePopUp(false)} style={styles.outside_modal}>
                              <TouchableWithoutFeedback>
                                   <View style={styles.inside_modal}>
                                        <Text style={styles.text_header}>ต้องการลบกิจกรรม!?</Text>
                                        <View style={styles.delete_condition_box}>
                                             <Pressable
                                                  style={[styles.delete_button]}
                                                  onPress={() => {
                                                       deleteActivity();
                                                       setCallDeletePopUp(false)}}>
                                                       <Text style={styles.text}>ใช่</Text>
                                             </Pressable>
                                             <Pressable
                                                  style={[styles.delete_button]}
                                                  onPress={() => setCallDeletePopUp(false)}>
                                                       <Text style={styles.text}>ยกเลิก</Text>
                                             </Pressable>
                                        </View>
                                   </View>
                              </TouchableWithoutFeedback>
                         </TouchableOpacity>
                    </Modal>

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
                    <StatusBar style='auto'/>
               </BlurView>
          );
     }
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
     },

     text_header: {
          fontFamily: "NotoSansThai_500Medium",
          fontSize: 18
     },

     table_body: {
          flex: 1
     },

     selection_footer: {
          position: 'relative',
          bottom: 0,
     },

     text: {
          fontFamily: "NotoSansThai_500Medium",
     },
     
     text_submit: {
          fontFamily: "NotoSansThai_500Medium",
          alignSelf: 'center',
          color: '#fff'
     },

     edit_box: {
          justifyContent: 'space-between',
          flexDirection: 'row',
     },

     edit_button: {
          marginHorizontal: 10
     },

     plus_activity_button: {
          position: 'relative',
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
          justifyContent: 'center',
          alignContent: 'center',
          width: 375,
          alignSelf: 'center',
     },

     plus_activity_text: {
          fontFamily: "NotoSansThai_500Medium", 
          textAlign: 'center'
     },

     form_input: {
          borderWidth: 1,
          marginVertical: 10,
          padding: 10,
          borderRadius: 3,
          height: 50
     },

     submit_form_button: {
          padding: 5,
          marginTop: 20,
          borderRadius: 5,
          height: 50,
          backgroundColor: '#0066A2',
          alignContent: 'center',
          justifyContent: 'center'
     },
     
     pickTime_box:{
          borderWidth: 1,
          paddingVertical: 10,
     },

     pickTime_button: {
          padding: 10,
          flexDirection: 'row',
     },

     text_pickTime: {
          marginLeft: 20, 
          fontFamily: "NotoSansThai_500Medium"
     },

     outside_modal: {
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center'
     },

     inside_modal: {
          width: '80%', 
          padding: 25, 
          backgroundColor: 'white', 
          borderRadius: 10,
          elevation: 10
     },

     delete_condition_box: {
          flexDirection: 'row',
          height: 50,
          justifyContent: 'flex-start',
          alignItems: 'flex-end'
     },

     delete_button: {
          marginRight: 75
     },

     snackbar: {
          bottom: 10
     }
});