import React, { useState } from "react";
import "./AuthenticationStyle.css";
import Axios from "axios";   // Captures HTTP requests from specified Paths, PROMISED based

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

    const register = () => {
        Axios({
            method: "POST",
            data: {
                username: registerUsername,
                password: registerPassword,
            },
            withCredentials: true,
            url: "http://localhost:4000/register",                 // POST TO this route (location of Backend login route)
        }).then((res) => {
            alert(res.data)
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
            url: "http://localhost:4000/login",
        }).then((res) => {
            if (res.data === 'Invalid Username/Password')
                alert(res.data)

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
            url: "http://localhost:4000/user",
        }).then((res) => {     // RESPONSE contains user object
            setisAuth(res.data)
        });
    };

    // Login / Registration Form
    return (
        <div className="App">

            <div className = "start">
                <h1> Calis</h1>
            </div>

            <div className = 'reg'>
                <h2>Register</h2>
                <input
                    placeholder="username"
                    onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                    type = 'password'
                    placeholder="password"
                    onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button onClick={register}>Register!</button>
            </div>

            <div className = 'login'>
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