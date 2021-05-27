// JSX return is wrapped in (), and remember that it can only return one Parent Element
import Button from './Button'

// Catch toggleAdd function prop from App.js
const Header = function( {toggleAdd, buttonColorDecider} )
{
    return (
        <header className = 'header'>
            <h1> Task Tracker </h1>
            <Button
                color = { buttonColorDecider ? 'red' : 'green' }
                text = { buttonColorDecider ? 'Done adding Tasks' : 'Start adding Tasks' }
                onClickFunction = {toggleAdd}      // Pass down toggleAdd function to Button.js as a Prop
            />
        </header>
    )
}

// What are you exposing to others that import this file?
export default Header