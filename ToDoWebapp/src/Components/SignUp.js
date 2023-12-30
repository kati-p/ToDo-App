import React, { useState, useRef } from 'react';
import styles from './SignUp.module.css'
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function SignUp() {

    // web browser
    const navigate = useNavigate();
    const [ cookie, setCookie] = useCookies(['token']);

    // variable
    const [ isEyeOpen1, setIsEyeOpen1 ] = useState(false);
    const [ isEyeOpen2, setIsEyeOpen2 ] = useState(false);
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

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

    // submit
    const handleSubmit = async () => {
        await setSnackBarOpen(false);

        // protect form
        const usernamePattern = /^\d+$/;

        if (username === '') {
            openSnackBar('ไม่สามารถยืนยันได้', 
                'กรุณาใส่เลขบัตรประชาชน', 
                'error'
            );
            return;
        }
        if (!usernamePattern.test(username)) {
            openSnackBar('ไม่สามารถยืนยันได้', 
                'เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น', 
                'error'
            );
            return;
        }
        if (username.length !== 13) {
            openSnackBar('ไม่สามารถยืนยันได้', 
                'เลขบัตรประชาชนต้องมี 13 หลัก', 
                'error'
            );
            return;
        }
        if (password === '') {
            openSnackBar('ไม่สามารถยืนยันได้', 
                'กรุณาใส่รหัสผ่าน', 
                'error'
            );
            return;
        }
        if (password.length > 50) {
            openSnackBar('ไม่สามารถยืนยันได้', 
                'รหัสผ่านมากเกินไป', 
                'error'
            );
            return;
        }
        if (password !== confirmPassword) {
            openSnackBar('ไม่สามารถยืนยันได้', 
                'ยืนยันรหัสผ่านผิดพลาด', 
                'error'
            );
            return;
        }

        // fetch API
        axios.post('http://localhost:5035/Users', {
            id : username,
            password : password
        })
        .then( (res) => {
            openSnackBar('ยืนยันได้สำเร็จ', 
                'คุณสามารถเข้าสู่ระบบด้วยบัญชีที่สมัครได้เลย', 
                'success'
            );
        })
        .catch( (e) => {

            if (e.response) {
                openSnackBar('ไม่สามารถยืนยันได้', 
                    e.response.data, 
                    'error'
                );
                console.log(e.response.data);
            } else if (e.request) {
                openSnackBar('ไม่สามารถยืนยันได้', 
                    'ไม่มีการตอบสนองจากเซิร์ฟเวอร์ กรุณาลองอีกครั้ง', 
                    'error'
                );
                console.log(e.request);
            } else {
                console.log('Error', e.message);
            }
            
            console.log(e);
        })
        
        //setCookie('token', 'WannaEatEggs');
        //navigate('/signIn');
    }

    return (
        
        <div className={styles.container}>
            <div className={styles.form}>
                {/* <div><div> should wrap by another div*/}
                <div className={styles['form-header']}>
                    <h1>Sign Up</h1> 
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
                        type={ isEyeOpen1 ? 'text' : 'password' } 
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
                        { isEyeOpen1 ? 
                            <VisibilityIcon 
                                className={styles['eye-icon']}
                                onClick={ () => { setIsEyeOpen1(false)}}
                            >
                            </VisibilityIcon> : 
                            <VisibilityOffIcon 
                                className={styles['eye-icon']}
                                onClick={ () => { setIsEyeOpen1(true)}}
                            >
                            </VisibilityOffIcon>
                        }
                    </div>
                    
                </div>
                <div className={styles['form-password']}>
                    <input 
                        id="confirm-password" 
                        value={confirmPassword} 
                        type={ isEyeOpen2 ? 'text' : 'password' } 
                        required
                        onChange={ (e) => {
                            setConfirmPassword(e.target.value);
                        }}
                    />
                    <div className={styles['input-label']}>
                        <KeyIcon></KeyIcon>
                        <label htmlFor='confirm-password'> ยืนยันรหัสผ่าน</label>
                    </div>
                    <div className={styles.adornment}>
                        { isEyeOpen2 ? 
                            <VisibilityIcon 
                                className={styles['eye-icon']}
                                onClick={ () => { setIsEyeOpen2(false)}}
                            >
                            </VisibilityIcon> : 
                            <VisibilityOffIcon 
                                className={styles['eye-icon']}
                                onClick={ () => { setIsEyeOpen2(true)}}
                            >
                            </VisibilityOffIcon>
                        }
                    </div>
                    
                </div>
                <div 
                    className={styles['form-submit']}
                    onClick={handleSubmit}
                >
                        <button>ยืนยัน</button>
                </div>
                <div className={styles['form-footer']}>
                    <a 
                        onClick={ () => { navigate('/signIn') }}
                    >
                            มีบัญชีแล้ว คลิก!
                    </a>
                </div>
            </div>
            { snackBar }
        </div>
    )
}

export default SignUp;