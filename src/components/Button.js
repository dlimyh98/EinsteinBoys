
// Catch toggleAdd function (called onClickFunction here) from Header.js
const Button = function( {text, color, onClickFunction} )
{
    return (
        <button
            onClick = {onClickFunction}             // When button is clicked, execute toggleAdd() function which originates from App.js
            style = {{backgroundColor : color}}     // toggleAdd function will invert showAddButton in App.js, which in turn affects Form visibility
            className = 'btn'
        >
            {text}
        </button>
    )
}

export default Button