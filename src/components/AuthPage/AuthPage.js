import React, {useState} from 'react';
import AuthPageStyle from './AuthPageStyle.css'

// Catching setauthToken function Prop from App.js
const AuthPage = function ({setauthToken}) {

    // Set LOCAL state for Username and Password
    const[username, setUsername] = useState();
    const[password, setPassword] = useState();

    // function definition for POST request to browser (Submitting what we have captured to the Browser, for authentication)
    // credentials is simply a placeholder in this function DEFINITION, we are NOT calling it here
    const formData = async(credentials) => {
        return (
            fetch('http://localhost:8080/Auth', {
                method : 'POST',
                headers : {'Content-type' : 'application/json'},
                body : JSON.stringify(credentials)
                }
                )
        )

            // Promise Chaining, executed IMMEDIATELY after fetch, NOT return
            .then(formData => formData.json())
    }


    // Form SUBMIT handler (calling formData function), when EVENT form submit is triggered
    const HandleformData = async(e) => {
        e.preventDefault()
        const token = await formData ({username, password})
        setauthToken(token)    // Calling the prop function passed by App.js
    }

    return(
        <div className = 'login-wrapper'>
            <h1>Please Log In</h1>
            <form onSubmit = {HandleformData} > {/* Event Handlers must be function or reference to function! */}
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        // onChange event triggers, whatever is being typed will be captured
                        onChange = { (e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        // onChange event triggers, whatever is being typed will be captured
                        onChange = { (e) => setPassword(e.target.value)}
                    />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AuthPage