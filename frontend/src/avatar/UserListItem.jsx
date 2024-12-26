import React from 'react'
import { ChatState } from '../provider/ChatProvider'
import "/src/css/side.css"

const UserListItem = ({user,handleFunction}) => {
    const {chats,setChats}=ChatState()
    
  return (
    <div>
        <button className="bm" onClick={handleFunction}>{user.name}</button>

        
    </div>
  )
}

export default UserListItem