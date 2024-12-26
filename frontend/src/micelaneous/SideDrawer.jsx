import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { ChatState } from '../provider/ChatProvider';
import UserListItem from '../avatar/UserListItem';
import { TfiCommentsSmiley } from "react-icons/tfi";
import { getSender } from '../config/chatLogics';
import "/src/css/drawer.css"



const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileBoxOpen, setIsProfileBoxOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const {chats, setChats, selectedChat, setSelectedChat,setToken,notification,setNotification } = ChatState()

  const { user, setUser } = ChatState();
  // console.log(user)

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const openProfileBox = () => {
    setIsProfileMenuOpen(false);
    setIsProfileBoxOpen(true);
  };

  const closeProfileBox = () => {
    setIsProfileBoxOpen(false);
  };

  const LogoutHandler = () => {
    // Remove userInfo from local storage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    setUser(null);
    setToken();

    // Verify that userInfo is removed
    if (!localStorage.getItem("userInfo")) {
        console.log("User logged out.");
        navigate("/");
    } else {
        console.error("Failed to log out: userInfo not cleared.");
    }
};


  const SubmitHandler = async () => {
    if (!search) {
      toast("Enter value to search");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResults(data);
    } catch (err) {
      toast("Error occurred");
    }
  };

  const accessChat=async (userId)=>{
    try{
        const config={
            headers:{
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${user.token}`,
            },
        }
        const {data}=await axios.post('/api/chat',{userId},config)
    
        if(!chats.find((c)=>c._id===data._id)) setChats([...chats,data])
        
      setIsSidebarOpen(false)
    }catch(err){
        console.log(err)
    }
  }
  const handleNotificationOpen=()=>{
    setIsNotificationOpen(!isNotificationOpen)
  }
  const handleOpenChat=(n)=>{
    setSelectedChat(n.chat)
    setNotification(notification.filter((n)=>n.chat._id!==selectedChat._id))
    setIsNotificationOpen(!isNotificationOpen)
  }

  return (
    <>
      <ToastContainer />
      <div style={{ height:"45px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f4f4f4' }}>
        <button onClick={handleSidebarToggle} style={{ padding: '10px', cursor: 'pointer' }}>
          Search User
        </button>
        <h2 className="heading">Talk-A-Tive</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Button to open notifications */}
                    <button 
                      onClick={() => handleNotificationOpen()} 
                      style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px', 
                        cursor: 'pointer', 
                        borderRadius: '50%', 
                        backgroundColor: '#007BFF', 
                        color: 'white', 
                        border: 'none', 
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
                        fontSize: '20px',
                        height:"30px",
                        width:"30px"
                      }}
                      title="View Notifications"
                    >
                      <TfiCommentsSmiley />
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                      <ul 
                        style={{ 
                          position: 'absolute', 
                          top: '50px', 
                          right: '0', 
                          backgroundColor: '#ffffff', 
                          width: '250px', 
                          maxHeight: '400px', 
                          overflowY: 'auto', 
                          border: '1px solid #f0f0f0', 
                          borderRadius: '8px', 
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
                          padding: '10px', 
                          zIndex: 1000 
                        }}
                      >
                        {!notification.length ? (
                          <p style={{ margin: 0, color: '#888', textAlign: 'center' }}>No new notifications</p>
                        ) : (
                          notification.map((n) => (
                            <li 
                              onClick={() =>handleOpenChat(n)}
                              key={n._id} 
                              style={{ 
                                listStyle: 'none', 
                                padding: '10px', 
                                borderBottom: '1px solid #f4f4f4', 
                                cursor: 'pointer', 
                                transition: 'background-color 0.2s ease-in-out' 
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              {n.chat.isGroupChat 
                                ? `New message in ${n.chat.chatName}` 
                                : `New message from ${getSender(user, n.chat.users)}`}
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>

          
          <div style={{ position: 'relative' }}>
            <button onClick={toggleProfileMenu} style={{ padding: '10px', cursor: 'pointer' }}>
              Profile
            </button>
            {isProfileMenuOpen && (
              <div style={{ position: 'absolute', top: '40px', right: 0, backgroundColor: '#fff', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', borderRadius: '5px', overflow: 'hidden', zIndex: 1000 }}>
                <button onClick={openProfileBox} style={{ padding: '10px', width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', backgroundColor: '#fff' }}>
                  Profile
                </button>
                <button onClick={LogoutHandler} style={{ padding: '10px', width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', backgroundColor: '#fff' }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isSidebarOpen ? 0 : '-300px',
          width: '300px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          padding: '20px',
          overflowY: 'auto',
          transition: 'left 0.3s ease-in-out',
          zIndex: 1000,
        }}
      >
        <button onClick={handleSidebarToggle} style={{ float: 'right', cursor: 'pointer' }}>Close</button>
        <h3>Search Users</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a user..."
            style={{ flex: 1, padding: '10px' }}
          />
          <button style={{ padding: '10px', cursor: 'pointer' }} onClick={SubmitHandler}>Go</button>
        </div>
        <ul>
          {searchResults?.map((user) => (
            // <li key={user._id} style={{ padding: '5px 0' }}>{user.name}</li>
            <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)} />
          ))}
        </ul>
      </div>

      {isProfileBoxOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          zIndex: 2000,
        }}>
          <h2 style={{ marginBottom: '20px' }}>Profile</h2>
          <div style={{display:"flex",justifyContent:"center"}}>
            <img
              src={user.pic}
              alt="Profile"
              style={{ borderRadius: '50%', marginBottom: '20px' ,height: '120px', width: '120px' }}
            />
          </div>
          
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={closeProfileBox} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      )}

      {isProfileBoxOpen && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={closeProfileBox}></div>}
    </>
  );
};

export default SideDrawer;