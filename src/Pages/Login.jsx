import React, { useState } from 'react'
import {  VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material'
import { Alert, CircularProgress, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setLogin } from '../store/authSlice'
import "../styles/login.css"

const Login = () => {
    const url = useSelector((state)=>state.auth.url);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);

    //-------------------Alert----------------------------//
    const [alert, setAlert] = useState({ open: false, message: "" });
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ ...alert, open: false });
    };


    const login = async (e) => {
        e.preventDefault();
        console.log("logging")
        setIsLoading(true);
        const response = await fetch(`${url}/auth/login`,
            {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" }
            });

        const loggedIn = await response.json();
        setIsLoading(false);
        console.log(loggedIn);
        if (loggedIn.status && loggedIn.status === "error") {
            setAlert({ open: true, message: loggedIn.msg });
        }
        else if (loggedIn.user && loggedIn.token) {
            // setOpen(true);
            dispatch(setLogin(
                {
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            )
            navigate('/');
        }
    }

    const handleBlur = (e) => {
        if (e.target.value === "")
            setAlert({ open: true, message: "Email required" })
        else {
             // eslint-disable-next-line
            let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            if (!regex.test(e.target.value)) {
                setAlert({ open: true, message: "Invalid email" })
            }
        }
    }
    return (
        <div className="pageContainer">
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleAlertClose} severity="error" variant='filled' sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar> 
           
            <div className="formContainer ">
            <h1 className="font-white font-heading ">Login Here!</h1>
                <form onSubmit={login}>
                    <div className='display-flex-col'>
                        <label htmlFor="" className="font-white">Email</label>
                        <input className='inputCont '
                            name='email'
                            value={email}
                            onBlur={handleBlur}
                            onChange={(e) => setEmail(e.target.value)}
                            required placeholder="Enter your email"
                        />

                    </div>
                    <div className="display-flex-col" style={{ position: "relative" }}>
                        <label className="font-white">Password</label>
                        <input className='inputCont' required
                            name='password' value={password}
                            type={hidePassword ? "password" : "text"}
                            placeholder='Enter you password'
                            onChange={(e) => setPassword(e.target.value)}

                        />
                        <div className='passwordIcon' onClick={() => setHidePassword(!hidePassword)}>{hidePassword ? <VisibilityOffRounded sx={{ color: "white" }} /> : <VisibilityRounded sx={{ color: "white" }} />}</div>

                    </div>
                    <button className='btn'
                        type='submit'>{isLoading ? <CircularProgress style={{ color: "black", width: "20px", height: "20px" }} /> : "Login"}</button>
                    <div className='font-white'>Dont have an Account?. <p className='font-link' onClick={() => navigate('/signup')}> SignUp</p>here!</div>
                </form>
            </div>
        </div>
    )
}

export default Login
