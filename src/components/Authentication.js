import React, { useState } from "react";
import "./AuthenticationStyle.css";
import 'animate.css'
import Axios from "axios";   // Captures HTTP requests from specified Paths, PROMISED based
import {RiEmotionHappyLine, RiEmotionUnhappyLine, ImHourGlass, AiOutlineFastBackward, GoThumbsup} from 'react-icons/all'

/*  How does Axios capture form data (using Registering as example)

    1. onChange event captures whatever the user is typing, and updates Stateful Value
    2. onClick event (clicking submission button) will trigger register FUNCTION
    3. Axios captures the following data
       - method (which HTTP request method do you want to use?)
       - data (can be an Object that which contains the properties we want to send over)
       - URL of service endpoint (POST TO this url, GET FROM this url)

       since Axios is PROMISED BASED, we use .then to declare what we want to do, after data successfully posted
 */

function Authentication( {setisAuth} ) {
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerText, setregisterText] = useState('')
    const [registerOk, setregisterOk] = useState(false)
    const [animationLeave, setAnimationLeave] = useState(false)
    const [animationEnter, setAnimationEnter] = useState(false)

    const [loginText, setloginText] = useState('')
    const [loginanimationLeave, setloginanimationLeave] = useState(false)
    const [loginanimationEnter, setloginanimationEnter] = useState(false)

    let uppercaseCheck = new RegExp ('(?=.*[A-Z])')
    let lowercaseCheck = new RegExp ('(?=.*[a-z])')
    let digitCheck = new RegExp ('(?=.*[0-9])')
    let specialCheck = new RegExp ('([^A-Za-z0-9])')

    // Register Animation
    function registerButtonDisplay () {
        document.getElementsByClassName("registerButtonAnimationLeave")[0].style.display = 'none'
    }

    function setGone () {
        return new Promise( function(resolve,reject) {
            setTimeout(() => registerButtonDisplay(), 1000)
            resolve()
        })
    }

    function animateLeave() {
        return new Promise(function(resolve,reject){
            setAnimationLeave(true)
            resolve()
        })
    }

    const animateEnter = () => {
        setTimeout( () => setAnimationEnter(true), 1000)
    }

    function animateLeaveEnter () {
        animateLeave().then(function () {
            setGone().then(function () {
                animateEnter()
            })
        })
    }

    function animateRegisterBack () {
        setAnimationLeave(false)
        setAnimationEnter(false)
        setregisterText('')
        setregisterOk(false)
        document.getElementsByClassName("registerButtonAnimationLeave")[0].style.display = 'block'
    }

    // Login Animation
    function loginButtonDisplay () {
        document.getElementsByClassName("loginButtonAnimationLeave")[0].style.display = 'none'
    }

    function loginsetGone () {
        return new Promise( function(resolve,reject) {
            setTimeout(() => loginButtonDisplay(), 1000)
            resolve()
        })
    }

    function loginanimateLeave() {
        return new Promise(function(resolve,reject){
            setloginanimationLeave(true)
            resolve()
        })
    }

    const loginanimateEnter = () => {
        setTimeout( () => setloginanimationEnter(true), 1000)
    }

    function loginanimateLeaveEnter () {
        loginanimateLeave().then(function () {
            loginsetGone().then(function () {
                loginanimateEnter()
            })
        })
    }

    function animateloginBack () {
        setloginanimationLeave(false)
        setloginanimationEnter(false)
        setloginText('')
        document.getElementsByClassName("loginButtonAnimationLeave")[0].style.display = 'block'
    }

    // Registration/Login
    const register = () => {
        Axios({
            method: "POST",
            data: {
                username: registerUsername,
                password: registerPassword,
            },
            withCredentials: true,
            url: "https://einsteinboys.herokuapp.com/api/register",                 // POST TO this route (location of Backend login route)
        }).then((res) => {
            // Invalid Username, Invalid Password, Username Already Taken, User Registered
            setregisterText(res.data)
            res.data === 'User Registered!' ? setregisterOk(true) : setregisterOk(false)
            animateLeaveEnter()
        });
    };

    const login = () => {
        Axios({
            method: "POST",
            data: {
                username: loginUsername,
                password: loginPassword,
            },
            withCredentials: true,
            url: "https://einsteinboys.herokuapp.com/api/login",
        }).then((res) => {
            if (res.data === 'Invalid Username/Password') {
                setloginText(res.data)
                loginanimateLeaveEnter()
            }

            else
                getUser()
        });
    };

    // Gets information from localhost:4000/user (BACKEND)
    // Backend is watching 4000/user, and will accordingly send back req.user (from Passportjs)
    const getUser = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "https://einsteinboys.herokuapp.com/api/user",
        }).then((res) => {     // RESPONSE contains user object
            setisAuth(res.data)
        });
    };

    return (
        <div className="App">
            <div className = "start">
                <h1 style = {{fontStyle : 'italic', fontFamily : "Chalkduster"}}> Calis </h1>
                <ImHourGlass fontSize = '2em'/>
            </div>

            <div className = {animationEnter ? 'registerButtonAnimationEnter' : 'registerText'}>
                <div style = {{fontSize : '2em'}}>
                    <span style = {{color : registerOk? 'green' : 'red'}}> {registerText} </span>
                    {registerOk ? <GoThumbsup/> :
                        <AiOutlineFastBackward
                            onClick = { () => animateRegisterBack()}
                        />
                    }
                </div>
            </div>

            <div className = {` ${animationLeave? 'registerButtonAnimationLeave' : 'reg'} `}>
                <h2>Register</h2>
                <input
                    placeholder="username"
                    onChange={(e) => setRegisterUsername(e.target.value)}
                />

                <span className='tooltipContainer'>
                <input
                    id = 'registerPassword'
                    type='password'
                    placeholder="password"
                    onInput={(e) => setRegisterPassword(e.target.value)}
                />
                <div className='passwordText'>
                    <div>  Minimum Length (4 characters) {registerPassword.length  >= 4 ? <RiEmotionHappyLine id = 'happyFace'/> : <RiEmotionUnhappyLine id = 'sadFace'/>} </div>
                    <div> At least one Uppercase Character {uppercaseCheck.test(registerPassword) ? <RiEmotionHappyLine id = 'happyFace'/> : <RiEmotionUnhappyLine id ='sadFace'/>} </div>
                    <div> At least one Lowercase Character {lowercaseCheck.test(registerPassword) ? <RiEmotionHappyLine id = 'happyFace'/> : <RiEmotionUnhappyLine id ='sadFace'/>} </div>
                    <div> At least one Digit {digitCheck.test(registerPassword) ? <RiEmotionHappyLine id = 'happyFace'/> : <RiEmotionUnhappyLine id ='sadFace'/>} </div>
                    <div> At least one Special Character {specialCheck.test(registerPassword) ? <RiEmotionHappyLine id = 'happyFace'/> : <RiEmotionUnhappyLine id ='sadFace'/>} </div>
                </div>
                </span>

                <button onClick={register}>Register!</button>
            </div>

            <div className = {loginanimationEnter ? 'loginButtonAnimationEnter' :'loginText' } style = {{fontSize : '2em'}}>
                <span style = {{color : 'red'}}> {loginText} </span>
                <AiOutlineFastBackward onClick = {() => animateloginBack()}/>
            </div>

            <div className = {loginanimationLeave ? 'loginButtonAnimationLeave' : 'login'}>
                <h2>Login</h2>
                <input
                    placeholder="username"
                    onChange={(e) => setLoginUsername(e.target.value)}
                />
                <input
                    type = 'password'
                    placeholder="password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button onClick={login}>Log in!</button>
            </div>
        </div>
    );
}

export default Authentication;
