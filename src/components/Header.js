// JSX return is wrapped in (), and remember that it can only return one Parent Element
import Button from './Button'

const Header = function( {buttonColorDecider, toggleAdd} )
{
    return (
        <header className = 'header'>
            <h1> CalisTracker </h1>
            <Button
                color = { buttonColorDecider ? 'red' : 'green' }
                text = { buttonColorDecider ? 'Done Adding' : 'Start Adding' }
                onClickFunction = {toggleAdd}      // Pass down toggleAdd function to Button.js as a Prop
            />
        </header>
    )
}

// What are you exposing to others that import this file?
export default Header