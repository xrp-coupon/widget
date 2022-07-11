import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
const xrpl = require("xrpl")
const client = new xrpl.Client(process.env.REACT_APP_XRPL_NETWORK);
const wallet = xrpl.Wallet.fromSeed(process.env.REACT_APP_XRPL_SEED); // For testing load from env

client.connect().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App xrp={{ client, wallet }} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}).catch((e) => {
  ReactDOM.render(
    <React.StrictMode>
      <h1>Unable to connect. Please try again via page refresh.</h1>
    </React.StrictMode>,
    document.getElementById('root')
  );
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
