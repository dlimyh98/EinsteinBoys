import './LoadingScreen.css'

const LoadingScreen = function() {
    return (
        <div className = "loadingScreen">
        <img
             src = {process.env.PUBLIC_URL + 'LoadingBurger.gif'} alt='loading...'
        />
        </div>
    )
}

export default LoadingScreen