// import App from 'next/app'
import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Web3ContextProvider } from "../ethereum/Web3Context";

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  );
}

export default MyApp;
