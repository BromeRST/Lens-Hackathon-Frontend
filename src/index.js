import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SignerContextProvider } from "./context/signer";

ReactDOM.render(
  <React.StrictMode>
    <SignerContextProvider>
      <App />
    </SignerContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);