import React, { useState, useEffect, useRef } from 'react';
import styles from './SignIn.module.css';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function SignIn() {
     
     // web browser
     const location = useLocation();
     const navigate = useNavigate();
     const [ cookie, setCookie ] = useCookies(['token']);

     // variable
     const [ isEyeOpen, setIsEyeOpen ] = useState(false);
     const [ username, setUsername ] = useState('');
     const [ password, setPassword ] = useState('');

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
          // remove token
          setCookie('token');

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
     },[])

     // submit
     const handleSubmit = async () => {
          await setSnackBarOpen(false);

          // protect form
          const usernamePattern = /^\d+$/;

          if (username === '') {
               openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                    'กรุณาใส่เลขบัตรประชาชน', 
                    'error'
               );
               return;
          }
          if (!usernamePattern.test(username)) {
               openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                    'เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น', 
                    'error'
               );
               return;
          }
          if (username.length !== 13) {
               openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                    'เลขบัตรประชาชนต้องมี 13 หลัก', 
                    'error'
               );
               return;
          }
          if (password === '') {
               openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                    'กรุณาใส่รหัสผ่าน', 
                    'error'
               );
               return;
          }
          if (password.length > 50) {
               openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                    'รหัสผ่านมากเกินไป', 
                    'error'
               );
               return;
          }

          // fetch API
          axios.post('http://localhost:5035/Tokens', {
               id : username,
               password : password
          })
          .then( (res) => {
               setCookie('token', res.data.token);

               /*openSnackBar('เข้าสู่ระบบสำเร็จ', 
                    '', 
                    'success'
               );*/
               
               navigate('/main', { state: {
                    isOpen: true,
                    title: 'เข้าสู่ระบบสำเร็จ',
                    message: '',
                    severity: 'success',
               }} );
          })
          .catch( (e) => {

               if (e.response.data) {
                    openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                         e.response.data, 
                         'error'
                    );
                    console.log(e.response.data);
               } else if (e.request) {
                    openSnackBar('ไม่สามารถเข้าสู่ระบบได้', 
                         'ไม่มีการตอบสนองจากเซิร์ฟเวอร์ กรุณาลองอีกครั้ง', 
                         'error'
                    );
                    console.log(e.request);
               } else {
                    console.log('Error', e.message);
               }
               
               console.log(e);
          })


          //setCookie('token', 'Wanna Eat Eggs')
          //navigate('/main');
     }

     // Slide Show
     // reference slideshow : https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
     const slideImage = ['./Image/to-do-pic-1.jpg', './Image/to-do-pic-2.jpg', './Image/to-do-pic-3.jpg', './Image/to-do-pic-4.jpg', './Image/to-do-pic-5.jpg'];
     const delay = 5000;
     const [ slideIndex, setSlideIndex ] = useState(0); 
     const timeoutRef = useRef(null);

     function resetTimeout() {
          if (timeoutRef.current) {
               clearTimeout(timeoutRef.current);
          }
     }

     useEffect(() => {
          resetTimeout();
          timeoutRef.current = setTimeout(
               () =>
                    setSlideIndex((prevIndex) =>
                         prevIndex === slideImage.length - 1 ? 0 : prevIndex + 1 
                    ),
               delay
          );

          return () => {
               resetTimeout();
          };
     }, [slideIndex])

     const slideshow = (
          <div className={styles.slideshow}>
               <div 
                    className={styles.slideshowSlider}
                    style={{ transform: `translate3d(${-slideIndex * 100}%, 0, 0)` }}
               >
                    {slideImage.map((imageURL, index) => (
                         <div className={styles.slide} key={index} style={{ backgroundImage: `url(${imageURL})`}}></div>
                    ))}                
               </div>

               <div className={styles.slideshowDots}>
                    {slideImage.map((_, idx) => (
                         <div 
                              key={idx} 
                              className={ styles[ `slideshowDot${slideIndex === idx ? "Active" : ""}` ]}
                              onClick={() => {
                                   setSlideIndex(idx);
                              }}
                         ></div>
                    ))}
               </div>
          </div>
     );

     return (

     <div className={styles.container}>
          { /* should use Grid for container */}
          <div className={styles['side-image']}>
               { slideshow }
          </div>
          <div className={styles.form}>
               {/* <div><div> should wrap by another div*/}
               <div className={styles['form-header']}>
                    <h1>ToDo</h1> 
               </div>
               <div className={styles['form-username']}>
                    {/* the input must before label bc "~" sibling require next element */}
                    {/* input must "require" bc to use :valid */}
                    <input 
                         id="username" 
                         value={username} 
                         type='text'  
                         required
                         onChange={ (e) => {
                              setUsername(e.target.value);
                         }}
                    />
                    <div className={styles['input-label']}>
                         <PersonIcon></PersonIcon>
                         <label htmlFor='username'> เลขบัตรประชาชน</label>
                    </div>
               </div>
               <div className={styles['form-password']}>
                    <input 
                         id="password" 
                         value={password} 
                         type={ isEyeOpen ? 'text' : 'password' } 
                         required
                         onChange={ (e) => {
                              setPassword(e.target.value);
                         }}
                    />
                    <div className={styles['input-label']}>
                         <KeyIcon></KeyIcon>
                         <label htmlFor='password'> รหัสผ่าน</label>
                    </div>
                    <div className={styles.adornment}>
                         { isEyeOpen ? 
                              <VisibilityIcon 
                                   className={styles['eye-icon']}
                                   onClick={ () => { setIsEyeOpen(false)}}
                              >
                              </VisibilityIcon> : 
                              <VisibilityOffIcon 
                                   className={styles['eye-icon']}
                                   onClick={ () => { setIsEyeOpen(true)}}
                              >
                              </VisibilityOffIcon>
                         }
                    </div>
               </div>
               <div 
                    className={styles['form-submit']}
                    onClick={handleSubmit}
               >
                         <button>เข้าสู่ระบบ</button>
               </div>
               <div className={styles['form-footer']}>
                    <a 
                         onClick={ () => { navigate('/signUp') }}
                    >
                              ยังไม่มีบัญชี คลิก!
                    </a>
               </div>
          </div>
          { snackBar }
     </div>
     )
}

export default SignIn;