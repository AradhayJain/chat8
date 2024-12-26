import React, { useEffect } from 'react';
import { ChatState } from '../provider/ChatProvider';
import SingleChat from '../avatar/SingleChat';
import "/src/css/chatbox.css"; // Import a CSS file for responsive styles

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();


 

  return (
    
    <div
      className={`chat-box ${
        selectedChat ? 'show-on-md' : 'hide-on-md'
      }`}
      
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
