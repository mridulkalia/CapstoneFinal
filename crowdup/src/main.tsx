import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { CrowdFundingProvider } from "../../blockchain/context/CrowdFunding.jsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <CrowdFundingProvider>/ */}
      <App />
    {/* </CrowdFundingProvider> */}
  </React.StrictMode>
);
