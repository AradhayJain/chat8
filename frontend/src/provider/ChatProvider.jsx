import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(); // Create the context

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState();
  const [token, setToken] = useState();
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate(); 
  // Use useNavigate directly


  // Fetch user info from localStorage when the component mounts
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    
    if (!userInfo) {
      // Navigate to login if no user info is found
      navigate("/");
      return;
    }
    setToken(token);
    setUser(userInfo);
    // setLoading(false);
  }, [navigate]); // Depend on `navigate` only to avoid unnecessary runs

  return (
    <UserContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats,token,setToken,messages,setMessages,notification,setNotification}}>

      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use context values
export const ChatState = () => {
  return useContext(UserContext);
};

export default UserContextProvider;
