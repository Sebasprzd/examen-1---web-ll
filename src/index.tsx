import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import ObtenerUsuarios from "./pages/users/listusers";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ObtenerUsuarios />
  </React.StrictMode>
);
