import React, { useEffect, useState } from 'react';
import { ChatState } from '../provider/ChatProvider';
import axios from 'axios';
import { getSender } from '../config/chatLogics.js';
import ChatLoading from './ChatLoading';
import '/src/css/chats.css';
import UserListItem from '../avatar/UserListItem';
import { ToastContainer, toast } from 'react-toastify';
import UserBadgeItem from '../avatar/UserBadgeItem';
import { Box } from '@chakra-ui/react';

const MyChats = ({ user, fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState({});
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState('');

  const fetchChats = async () => {
    if (!user?.token) {
      console.error('No user token available!');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (err) {
      console.error('Error fetching chats:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    setLoggedUser(storedUser);

    // Ensure we fetch chats only after the user is set
    if (storedUser) {
      fetchChats();
    }
  }, [fetchAgain]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const setHandler = (chat) => {
     // Log the chat object when clicked
    setSelectedChat(chat);

  };

  const createGroupHandler = async () => {
    if (!groupChatName || !selectedUsers) {
      toast('Please fill all fields to create a group chat');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        '/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setSelectedUsers()
      setSearchResult()
      setGroupChatName()
    } catch (error) {
      console.log(error);
    }

    closeModal();
  };

  const manageGroups = (AddTo) => {
    if (selectedUsers.includes(AddTo)) {
      toast('user already exists');
      return;
    }
    setSelectedUsers([...selectedUsers, AddTo]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

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

  return (
    <div className={`my-chats-container ${selectedChat ? 'hidden-on-md' : 'flex-on-md'}`}>
      <ToastContainer />
      <div className="header">
        <span>My Chats</span>
        <button className="new-group-btn" onClick={openModal}>
          New Group Chat
        </button>
      </div>
      <div className="chat-list">
        {chats ? (
          <div className="chat-items">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${selectedChat === chat ? 'selected-chat' : ''}`}
                onClick={() => setHandler(chat)} // Ensure this triggers setHandler with the correct chat
              >
                <div className="chat-name">
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className="latest-message">
                    <b>{chat.latestMessage.sender.name===user.name?"Me":chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? `${chat.latestMessage.content.substring(0, 51)}...`
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>

      {/* Modal for Creating Group */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Group Chat</h2>
            <input
              type="text"
              value={groupChatName}
              placeholder="Group Name"
              className="modal-input"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <input
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Add users"
              className="modal-textarea"
            />
            <div className="select">
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </div>

            {searchResult?.slice(0, 4).map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => manageGroups(user)} />
            ))}
            <div className="modal-actions">
              <button onClick={createGroupHandler} className="modal-btn">
                Create
              </button>
              <button onClick={closeModal} className="modal-btn cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChats;
