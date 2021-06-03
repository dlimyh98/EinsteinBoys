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
    // Takes the data that I am getting from server, and save it in State. So that I can use it later in my application
    const [data, setData] = useState(null);

    const register = () => {
        Axios({
            method: "POST",
            data: {
                username: registerUsername,
                password: registerPassword,
            },
            withCredentials: true,
            url: "http://localhost:4000/register",                 // POST TO this route (location of Backend login route)
        }).then((res) => console.log(res));
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
        }).then((res) => console.log(res));
    };

    // Gets information from localhost:4000/user (BACKEND)
    // Backend is watching 4000/user, and will accordingly send back req.user (from Passportjs)
    const getUser = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/user",
        }).then((res) => {     // RESPONSE contains user object
            setData(res.data);                    // access Axios RESPONSE object's data field (payload returned from server)
            setisAuth(res.data)
        });
    };

    // Login / Registration Form
    return (
        <div className="App">
            <div>
                <h1>Register</h1>
                <input
                    placeholder="username"
                    onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                    placeholder="password"
                    onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button onClick={register}>Submit</button>
            </div>

            <div>
                <h1>Login</h1>
                <input
                    placeholder="username"
                    onChange={(e) => setLoginUsername(e.target.value)}
                />
                <input
                    placeholder="password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button onClick={login}>Submit</button>
            </div>

            <div>
                <h1>Enter App</h1>
                <button onClick={getUser}>Click Me!</button>
                {data ? <h1>Welcome Back {data.username}</h1> : null}
            </div>
        </div>
    );
}

export default Authentication;