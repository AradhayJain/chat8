import React, { useState } from 'react'
import { ChatState } from '../provider/ChatProvider'
// import { Box } from '@chakra-ui/react'
import SideDrawer from '../micelaneous/SideDrawer'
import MyChats from '../micelaneous/MyChats'
import ChatBox from '../micelaneous/ChatBox'
import "/src/css/ChatPage.css"

const ChatPage = () => {
    const {user}=ChatState()
    const [fetchAgain,setFetchAgain]=useState(false)
  return (
        <div style={{width:"100%"}}>
            <SideDrawer setFetchAgain={setFetchAgain}/>
            <div className='Box'>
            {user ? (
                <MyChats user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                ) : (
                <div>Loading...</div>
                )}
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
            </div>
        </div>
  )
  
}

export default ChatPage