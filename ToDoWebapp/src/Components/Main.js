import MaterialTable from 'material-table'
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import { forwardRef, useRef, useState, useEffect } from 'react';
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import styles from './Main.module.css';
import '../index.css';
import SideBar from './SideBar';
import Header from './Header';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function Main() {

  // web browser
  const location = useLocation();
  const navigate = useNavigate();
  const [ cookies, setCookie ] = useCookies(['token']);

  // variable
  const [ data, setData ] = useState([]);

  // format export date to valid by +GWT
  const formatExportDate = (d) => {
    const date = new Date(d);
    const offsetMS = date.getTimezoneOffset() * 60 * 1000;
    const newDate = new Date(date.getTime() - offsetMS);
    //console.log(newDate.toJSON());
    return newDate.toJSON().slice(0, 16);
  };

  // Snack Bar
  const [ snackBarOpen, setSnackBarOpen ] = useState(false);
  const snackBarTitle = useRef('Tea Latte');
  const snackBarMessage = useRef('I Love Coffee');
  const alertSeverity = useRef('success');
  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }        
      setSnackBarOpen(false);
  };
  const snackBar = (
    <Snackbar 
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          style={{ width: '400px' }}
    >
          <Alert
              onClose={handleClose}
              severity={alertSeverity.current}
              style={{ width: '100%' }}
          >
              <AlertTitle>{snackBarTitle.current}</AlertTitle>
              {snackBarMessage.current}
          </Alert>
    </Snackbar>
  );
  const openSnackBar = ( title, message, severity ) => {
    alertSeverity.current = severity;
    snackBarTitle.current = title;
    snackBarMessage.current = message;
    setSnackBarOpen(true);
  }

  // use effect first entry
  useEffect( () => {
           
    // Debug Area
    //console.log(dayjs(new Date()))

    // Verify token
    if (cookies.token === 'undefined') {
      /*openSnackBar(
        'ไม่สิทธิเข้าสู่ระบบได้', 
        'กรุณาเข้าสู่ระบบ', 
        'error'
      );*/
      navigate('/signin', { state: {
        isOpen: true,
        title: 'ไม่สิทธิเข้าสู่ระบบได้',
        message: 'กรุณาเข้าสู่ระบบ',
        severity: 'error',
      }});
      console.log('token undefined');
      // must return bc javaScript'll run axios and the navigation's state will disappear
      return;
    }
    
    // snack bar from others' navigation
    //console.log(location);
    if ( location.state && location.state.isOpen ) {
      openSnackBar( 
        location.state.title,
        location.state.message,
        location.state.severity
      );
    }
    // clear stack
    navigate(location.pathname, {});
    
    // fetch API GET ALL
    axios.get(
      'http://localhost:5035/Activities',
      { headers: { "Authorization": 'Bearer ' + cookies.token } }
    )
    .then( (res) => {
      if (res.data) {
        setData(res.data);
        //console.log(res.data);
      } else {
        console.log('no content');
      }
    })
    .catch( (e) => {

      if (e.response) {
          
          console.log(e.response.data);
      } else if (e.request) {
            
          console.log(e.request);
      } else {

          console.log('Error', e.message);
      }

      console.log(e);
      navigate('/signin')
    });

  },[])

  // Material Table: https://material-table.com/#/docs/get-started
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  }

  const [ columns, setColumns ] = useState([
      { title: 'กิจกรรม', field: 'name'},
      { 
        title: 'วันเวลา', 
        field: 'when',
        initialEditValue: dayjs(new Date()),
        editComponent: (props) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker 
              defaultValue={dayjs(props.value)}
              onChange={props.onChange}
            />
          </LocalizationProvider>
        ),
        render: rowData => {
          // format date
          const date = new Date(rowData.when);
          const day = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',

          });
          const time = date.toString().slice(16, 21).replace(/[-T]/g, ':');

          return (
            <div>
              <p>{day}</p>
              <p>เวลา {time}</p>
            </div>
          );
        }
      },
      {
        title: 'คงเหลือ',
        field: 'remain',
        editable: 'never',
        render: rowData => {
          const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
          const now = new Date();
          const date = new Date(rowData.when);
          const remain = Math.round((date - now) / oneDay);
          
          if (remain < 0) {
            return <p style={{color:'	#FF0000'}}>เลยกำหนดการ</p>
          } else{
            return <p>{remain} วัน</p>
          }
        }
      }
  ]);

  const defaultMaterialTheme = createTheme();

  return (
    <div className={styles.container}>
      <Header/>
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          icons={tableIcons}
          title={''}
          columns={columns}
          data={data}
          editable={{
            onRowAdd: newData => {
              // catch user error
              if (!newData.name){
                openSnackBar(
                  'ไม่สามารถเพิ่มกิจกรรมได้',
                  'กรุณาใส่ชื่อกิจกรรม',
                  'error'
                );
                return new Promise((resolve) => resolve());
              }
              if (!newData.when) {
                openSnackBar(
                  'ไม่สามารถเพิ่มกิจกรรมได้',
                  'กรุณาใส่เวลา',
                  'error'
                );
                return new Promise((resolve) => resolve());
              }
              if (!new Date(newData.when).getTime() || new Date(newData.when).getTime() < 0) {
                openSnackBar(
                  'ไม่สามารถเพิ่มกิจกรรมได้',
                  'ไม่สามารถใช้เวลาที่กำหนดได้',
                  'error'
                );
                console.log("Date's time is less than zero.");
                return new Promise((resolve) => resolve());
              }
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  axios.post(
                    'http://localhost:5035/Activities',
                    { 
                      name: newData.name,
                      when: formatExportDate(newData.when)
                    },
                    { headers: { "Authorization": 'Bearer ' + cookies.token } }
                  )
                  .then( (res) => {
                    // success
                    newData.id = res.data.id;
                    setData([...data, newData]);
                    openSnackBar(
                      'เพิ่มกิจกรรมสำเร็จ',
                      '',
                      'success'
                    );
                    resolve();
                  })
                  .catch( (e) => {

                    if (e.response) {
                        
                        console.log(e.response.data);
                    } else if (e.request) {
                          
                        console.log(e.request);
                    } else {
              
                        console.log('Error', e.message);
                    }
                    openSnackBar(
                      'ไม่สามารถเพิ่มกิจกรรมได้',
                      e.message,
                      'error'
                    );
                    console.log(e);
                  });
                  
                  resolve();
                }, 1000)
              })
            },
            onRowUpdate: (newData, oldData) => {
              // catch user error
              if (!newData.name){
                openSnackBar(
                  'ไม่สามารถเพิ่มกิจกรรมได้',
                  'กรุณาใส่ชื่อกิจกรรม',
                  'error'
                );
                return new Promise((resolve) => resolve());
              }
              if (!newData.when) {
                openSnackBar(
                  'ไม่สามารถเพิ่มกิจกรรมได้',
                  'กรุณาใส่เวลา',
                  'error'
                );
                return new Promise((resolve) => resolve());
              }
              if (!new Date(newData.when).getTime() || new Date(newData.when).getTime() < 0) {
                openSnackBar(
                  'ไม่สามารถเพิ่มกิจกรรมได้',
                  'ไม่สามารถใช้เวลาที่กำหนดได้',
                  'error'
                );
                console.log("Date's time is less than zero.");
                return new Promise((resolve) => resolve());
              }          
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  axios.put(
                    'http://localhost:5035/Activities/' + oldData.id,
                    { 
                      name: newData.name,
                      when: formatExportDate(newData.when)
                    },
                    { headers: { "Authorization": 'Bearer ' + cookies.token } }
                  )
                  .then( (res) => {
                    // success
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    openSnackBar(
                      'แก้ไขกิจกรรมสำเร็จ',
                      '',
                      'success'
                    );
                  })
                  .catch( (e) => {

                    if (e.response) {
                        
                        console.log(e.response.data);
                    } else if (e.request) {
                          
                        console.log(e.request);
                    } else {
              
                        console.log('Error', e.message);
                    }
                    openSnackBar(
                      'ไม่สามารถแก้ไขกิจกรรมได้',
                      e.message,
                      'error'
                    );
                    console.log(e);
                  });                  

                  resolve();
                }, 1000)
              })
            },
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  axios.delete(
                    'http://localhost:5035/Activities/' + oldData.id,
                    { headers: { "Authorization": 'Bearer ' + cookies.token } }
                  )
                  .then( (res) => {
                    // success
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    openSnackBar(
                      'ลบกิจกรรมสำเร็จ',
                      '',
                      'success'
                    );
                  })
                  .catch( (e) => {

                    if (e.response) {
                        
                        console.log(e.response.data);
                    } else if (e.request) {
                          
                        console.log(e.request);
                    } else {
              
                        console.log('Error', e.message);
                    }
                    openSnackBar(
                      'ไม่สามารถลบกิจกรรมได้',
                      e.message,
                      'error'
                    );
                    console.log(e);
                  });                  
                  
                  resolve()
                }, 1000)
              }),
          }}
          options={{
            pageSize: 8,
            pageSizeOptions: [8,10,20],
          }}
        />
      </ThemeProvider>
      { snackBar }
    </div>
  )
}

export default Main;