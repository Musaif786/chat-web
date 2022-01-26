import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
//Bootstrap css
// import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
  <ToastContainer  />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
