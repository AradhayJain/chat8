import React from 'react';
import { ChatState } from '../provider/ChatProvider';

const ScrollToChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      {messages &&
        messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.sender.name === user.name ? 'flex-start' : 'flex-end',
              margin: '10px 0',
            }}
          >
            <div
              style={{
                minWidth: '30%',
                maxWidth: '70%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: message.sender.name === user.name ? '#d1e7dd' : '#f8d7da',
                color: '#000',
                textAlign: message.sender.name === user.name ? 'left' : 'right',
                wordWrap: 'break-word',
              }}
            >
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {message.sender.name === user.name ? 'Me' : message.sender.name}:
              </p>
              {message.content}
            </div>
          </div>
        ))}
    </>
  );
};

export default ScrollToChat;
