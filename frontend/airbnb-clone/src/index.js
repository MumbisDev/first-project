import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional: add your global CSS here
import App from './App'; // Import the main App component
import reportWebVitals from './reportWebVitals'; // Optional: for measuring performance

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This will render your app into the div with id "root" in index.html
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();