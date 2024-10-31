import React, { useContext } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthContext } from "./context/AuthContext";

const Home = () => <h2>Welcome to the Home Page</h2>;

const App = () => {
  const { user, logout } = useContext(AuthContext); // This should now work correctly

  return (
    <div>
      {user ? (
        <div>
          <Home />
          <Chat /> {/* Display chat only if the user is authenticated */}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <Login />
          <Register />
        </div>
      )}
    </div>
  );
};

export default App;
