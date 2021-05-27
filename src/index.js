import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';   // App JS contains root component. (every component that we create, will be in this main root app component)
import reportWebVitals from './reportWebVitals';


// Inserting app from App.js, into root ID element
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
