import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Adjust the path if needed
import { AuthProvider } from "./context/AuthContext"; // Adjust the path if needed

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
