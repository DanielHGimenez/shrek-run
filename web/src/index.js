import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../node_modules/izitoast/dist/css/iziToast.min.css'
import '../node_modules/izitoast/dist/js/iziToast.min.js'
import '../node_modules/izimodal/css/iziModal.min.css'
import '../node_modules/izimodal/js/iziModal.min.js'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './ui/page/app/App';
import Party from './ui/page/party/Party.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route index element={<App/>}/>
          <Route path="/party" element={<Party/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
