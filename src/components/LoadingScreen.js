import './LoadingScreen.css'

const LoadingScreen = function() {
    return (
        <img className="loadingScreen"
             src = {process.env.PUBLIC_URL + 'LoadingBurger.gif'} alt='loading...'
        />
    )
}

export default LoadingScreen