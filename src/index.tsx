import React from "react";
import ReactDOM from "react-dom/client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

Amplify.configure(awsExports);

root.render(
  <BrowserRouter>
    <Authenticator>{({ signOut }) => <App signOut={signOut} />}</Authenticator>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
