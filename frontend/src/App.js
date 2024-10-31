import React, { useContext, useState, useEffect } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

const Home = () => <h2>Welcome to the Home Page</h2>;

const App = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]); // State to hold list of users
  const [receiverId, setReceiverId] = useState(null); // State to hold selected receiverId
  console.log(users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/users");
        console.log("Fetched users:", res.data); // Check the output in the console
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    setReceiverId(userId); // Set the selected receiverId
    console.log("Selected receiver ID:", userId); // Log selected receiver ID
  };

  return (
    <div>
      {user ? (
        <div>
          <Home />
          <h3>Available Users:</h3>
          <ul style={{ color: "black" }}>
            {users.map((u) => (
              <li key={u._id} onClick={() => handleUserClick(u._id)}>
                {u.username}
              </li>
            ))}
          </ul>
          {receiverId && (
            <>
              <h3>Chatting with User ID: {receiverId}</h3>
              <Chat receiverId={receiverId} />
            </>
          )}
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
