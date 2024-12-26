import React, { useEffect, useState } from 'react'
import { ChatState } from '../provider/ChatProvider'
import { getSender } from '../config/chatLogics.js'
import { Icon } from "@chakra-ui/react"
import "/src/css/single.css"
import { CloseButton } from "@/components/ui/close-button"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { GoArrowLeft } from "react-icons/go";
import UserListItem from './UserListItem.jsx'
import { HiEllipsisVertical } from "react-icons/hi2";
import { Spinner } from '@chakra-ui/react'
import ScrollToChat from './ScrollToChat.jsx'
import io from 'socket.io-client';
import Lottie from "react-lottie";
import animationData from "/src/animations/animation.json"
import { Menu } from '@chakra-ui/react'


const ENDPOINT = 'http://localhost:3000';
var socket,selectedChatCompare;
const SingleChat = ({fetchAgain,setFetchAgain }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const {user,selectedChat,setSelectedChat,messages,setMessages,notification,setNotification}=ChatState()
    const [isProfileBoxOpen, setIsProfileBoxOpen] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState('');
    const [renameOpen, setRenameOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const [typing,setTyping]=useState(false);
    const [isTyping,setIsTyping]=useState(false);

    const handleClick=()=>{

        setIsProfileBoxOpen(true)
    }
    useEffect(() => {
        socket=io(ENDPOINT);
        socket.emit('setup',user);
        socket.on('connected', () => {
            setConnected(true);
        

    },[])
        socket.on('typing', () => {
            setIsTyping(true);
        }
        )
        socket.on('stop typing', () => {
            setIsTyping(false);
        })

    },[])

    const addMembers = async (user1) => {
        if(selectedChat.groupAdmin._id!==user._id){
            toast.error('You are not the admin of this group')
            return; 
        }
        if(selectedChat.users.includes(user1)){
            toast.error('User already in the group')
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id,

            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        }
        catch(err){
            console.error('Error adding user to group chat:', err.response?.data || err.message);
            toast.error('Failed to add user to group chat');
        }
    };
    const renameFunction = async () => {
        const gp=window.prompt('Enter new group name');
        if (!gp) {
            toast.error('Please enter a group name');
            return;
        }
        if(gp===selectedChat.chatName){
            toast.error('Group name cannot be the same')
            return;
        }
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: gp,
            }, config);
            setRenameOpen(false);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            toast.success('Group chat renamed successfully');
        } catch (err) {
            console.error('Error renaming group chat:', err.response?.data || err.message);
            toast.error('Failed to rename group chat');
        }

    }

    const closeProfileBox = () => {
        setIsProfileBoxOpen(false);
        setRenameOpen(false);
    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/api/user?search=${search}`, config);
          setSearchResult(data);
        } catch (err) {
          console.log(err);
        }
      };
    const removeFromGroup = async (user1) => {
        if(selectedChat.groupAdmin._id!==user._id){
            toast.error('You are not the admin of this group')
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
    
            const { data } = await axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);
    
            // Update the selectedChat state to reflect the changes after user removal
            if (user1._id === user._id) {
                // If the current user is removed, set selectedChat to null (or a fallback chat)
                setSelectedChat(); // You can decide what to set in case of current user removal
            } else {
                setSelectedChat(data); // Update the selectedChat with the new group data
            }
    
            // Display success message
            toast.success('User removed from group chat');
    
            // Trigger re-fetching of chat data
            setFetchAgain(!fetchAgain);
        } catch (err) {
            console.error('Error removing user from group chat:', err.response?.data || err.message);
            toast.error('Failed to remove user from group chat');
        }
    };
    const sendMessage=async (event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit('stop typing',selectedChat._id);
            try{
                const config = {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                setLoading(true);
                setMessages([...messages,data])
                socket.emit('new message', data);

                setFetchAgain(!fetchAgain);
                
                
                
            }catch(err){
                console.error('Error sending message:', err.response?.data || err.message);
                toast.error('Failed to send message');
                setLoading(false);
            }
        }
    }
    const typingHandler=(e)=>{
        setNewMessage(e.target.value)

        if(!connected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }
        let lastTypingTime=new Date().getTime();
        var timeLength=3000;
        setTimeout(() => {
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;
            if(timeDiff>=timeLength && typing){
                socket.emit('stop typing',selectedChat._id);
                setTyping(false);
            }
        }, timeLength);
    }

    const fetchMessages = async () => {
        if(!selectedChat)return;
        try {
            const config = {
                headers: {
                    
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setLoading(true);

            setMessages(data);
            console.log(messages)
            socket.emit('join chat', selectedChat._id);

        } catch (err) {
            console.error('Error fetching messages:', err.response?.data || err.message);
            toast.error('Failed to fetch messages');
        }
    }
    useEffect(() => {
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived,...notification])
                    setFetchAgain(!fetchAgain);

                    return;
                }

            }
            else{
                setFetchAgain(!fetchAgain);
                setMessages([...messages,newMessageReceived])
            }
        })
    })


    

    


  return (
    <>
        
       {
        selectedChat?(
            <>
                <div>
                <ToastContainer/>
                    {!selectedChat.isGroupChat?(
                        <>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                            <div style={{display:"flex", alignItems:"center",gap:"10px" ,justifyContent:"space-between"}}>
                            <GoArrowLeft onClick={()=>setSelectedChat()}/>

                        
                            {getSender(user,selectedChat.users)}
                            </div>
                         
                        
                          <div onClick={handleClick}><Icon fontSize="40px" color="red.500">
                                <svg viewBox="0 0 32 32">
                                    <g fill="currentColor">
                                    <path d="M16,11.5a3,3,0,1,0-3-3A3,3,0,0,0,16,11.5Z" />
                                    <path d="M16.868.044A8.579,8.579,0,0,0,16,0a15.99,15.99,0,0,0-.868,31.956A8.579,8.579,0,0,0,16,32,15.99,15.99,0,0,0,16.868.044ZM16,26.5a3,3,0,1,1,3-3A3,3,0,0,1,16,26.5ZM16,15A8.483,8.483,0,0,0,8.788,27.977,13.986,13.986,0,0,1,16,2a6.5,6.5,0,0,1,0,13Z" />
                                    </g>
                                </svg>
                                </Icon>
                          </div>
                          
                            
                            

                        </div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"70vh","marginTop":"20px"}}>
                            <div style={{position:"relative" ,width:"100%",height:"100%",overflowY:"hidden",backgroundColor:"#D3D3D3",borderRadius:"10px"}}>
                            {!loading?<Spinner display="block" position="absolute" width="30px" height="30px" alignSelf="end" left="50%" bottom="50%" />:
                               <>
                               <div className='messages' style={{height:"90%",position:"relative",backgroundColor:"white" ,overflowY:"auto",padding:"10px"}}>
                                <ScrollToChat messages={messages} />
                               </div>
                               
                               </>
                               
                                   
                               }
                                <div onKeyDown={sendMessage} style={{ alignContent: "center", marginTop: "10px", width: "100%", position: "absolute", bottom: "0" }}>
                                
                                <textarea
                                    placeholder="Enter message"
                                    onChange={(e)=>typingHandler(e)}
                                    value={newMessage}
                                    style={{
                                    position:"absolute",
                                    bottom:"0",
                                    backgroundColor: "#fff",
                                    width: "100%",
                                    height: "40px",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    overflowY: "auto", // Enable vertical scrolling
                                    overflowX: "hidden", // Disable horizontal scrolling
                                    resize: "none", // Prevent resizing of the textarea
                                    
                                    }}
                                />
                                </div>

                            </div>
                        </div>
                        

                        </>
                        

                    ):(
                        <>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                        <GoArrowLeft onClick={()=>setSelectedChat()}/>
                        {selectedChat.chatName}
                          <div onClick={handleClick}><Icon fontSize="40px" color="red.500">
                                <svg viewBox="0 0 32 32">
                                    <g fill="currentColor">
                                    <path d="M16,11.5a3,3,0,1,0-3-3A3,3,0,0,0,16,11.5Z" />
                                    <path d="M16.868.044A8.579,8.579,0,0,0,16,0a15.99,15.99,0,0,0-.868,31.956A8.579,8.579,0,0,0,16,32,15.99,15.99,0,0,0,16.868.044ZM16,26.5a3,3,0,1,1,3-3A3,3,0,0,1,16,26.5ZM16,15A8.483,8.483,0,0,0,8.788,27.977,13.986,13.986,0,0,1,16,2a6.5,6.5,0,0,1,0,13Z" />
                                    </g>
                                </svg>
                                </Icon>
                          </div>
                          
                            
                            

                        </div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"70vh","marginTop":"20px"}}>
                            <div style={{position:"relative" ,display:"flex",alignItems:"center",justifyContent:"center" ,width:"100%",height:"100%",overflowY:"hidden",backgroundColor:"#D3D3D3",borderRadius:"10px"}}>
                               {!loading?<Spinner display="block" position="absolute" width="30px" height="30px" alignSelf="end" left="50%" bottom="50%" />:
                               <>
                               <div className='messages' style={{position:"absolute",top:"0",height:"90%",backgroundColor:"white",width:"100%",overflowY:"auto",padding:"10px"}}>
                                <ScrollToChat messages={messages} />
                               </div>
                               
                               </>
                               
                                   
                               }
                                <div onKeyDown={sendMessage} style={{ alignContent: "center", marginTop: "10px", width: "100%", position: "absolute", bottom: "0" }}>
                                {isTyping?<div><Lottie
                                width={70}
                                options={defaultOptions}
                                style={{marginRight:"10px"}}
                                
                                /></div>:<></>}
                                <textarea
                                    placeholder="Enter message"
                                    onChange={(e)=>typingHandler(e)}
                                    value={newMessage}
                                    style={{
                                    backgroundColor: "#fff",
                                    width: "100%",
                                    height: "40px",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    overflowY: "auto", // Enable vertical scrolling
                                    overflowX: "hidden", // Disable horizontal scrolling
                                    resize: "none", // Prevent resizing of the textarea
                                    
                                    }}
                                />
                                </div>

                               

                            </div>
                        </div>
                        

                        </>
                    )}

                        {isProfileBoxOpen && (
                        <div
                            style={{
                            position: 'fixed',
                            
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '300px',
                            backgroundColor: '#fff',
                            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                            borderRadius: '10px',
                            padding: '20px',
                            textAlign: 'center',
                            zIndex: 2000,
                            }}
                        >
                            <h2 style={{ marginBottom: '20px' }}>Profile</h2>

                            {/* Display chat name */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div><strong>Name:</strong> {!selectedChat.isGroupChat ? getSender(user,selectedChat.users) : selectedChat.chatName}</div>
                                {selectedChat.isGroupChat && <HiEllipsisVertical  onClick={()=>setRenameOpen(true)}/>}
                            </div>

                            {/* Render group members if it's a group chat */}
                            {selectedChat.isGroupChat && (
                            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>Group Members:</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {selectedChat.users.map((user) => (
                                        <li
                                        key={user._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between', // Ensures spacing between content and CloseButton
                                            marginBottom: '10px',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            backgroundColor: '#f5f5f5',
                                            transition: 'background-color 0.3s ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#e0e0e0'; // Hover color
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f5f5f5'; // Original color
                                        }}
                                        >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                            src={user.pic}
                                            alt={user.name}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                            }}
                                            />
                                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                                        </div>
                                        <CloseButton onClick={()=>removeFromGroup(user)}/>
                                        </li>
                                    ))}
                                </ul>
                                <input placeholder="add members" onChange={(e)=>handleSearch(e.target.value)} type="text" style={{width:"100%",height:"40px",padding:"10px",borderRadius:"5px",border:"1px solid #ccc",marginBottom:"20px"}}/>
                                {searchResult?.slice(0,4).map((user)=>(
                                    <UserListItem key={user._id} user={user} handleFunction={()=>addMembers(user)} />
                                ))}

                            </div>
                            )}

                            <button
                            onClick={closeProfileBox}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            >
                            Close
                            </button>
                        </div>
                        )}
                        {renameOpen && (
                          <div
                            onClick={() => renameFunction()}
                            style={{
                            position: 'fixed',
                            top: "30%",
                            left: "55%",
                            width: '170px',
                            height: '60px',
                            backgroundColor: 'white',
                            zIndex: 1000000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            }}
                            
                        > rename group
                            </div>
                        )}  


               </div>
            </>
        ):(
            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <h1>please select a chat</h1>
            </div>
        )
       }
    </>
    )
  
}

export default SingleChat