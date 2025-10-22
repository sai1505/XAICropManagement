import React, { useState, createContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserDashboardNavbar from './UserDashboardNavbar';

// Create the context for chat functionality
export const UserChatContext = createContext(null);

function UserDashboardLayout() {
    const navigate = useNavigate();
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [chatSessions, setChatSessions] = useState([]);

    // Function to start a new chat
    const startNewChat = () => {
        const newChatId = Date.now().toString();
        const newChat = {
            id: newChatId,
            messages: [],
            createdAt: new Date(),
            title: 'New Chat'
        };

        setCurrentChat(newChat);
        setChatSessions(prev => [newChat, ...prev]);
        navigate('/dashboard/chat');
    };

    // Function to add message to current chat
    const addMessage = (message) => {
        if (!currentChat) return;

        const updatedChat = {
            ...currentChat,
            messages: [...currentChat.messages, message]
        };

        setCurrentChat(updatedChat);

        // Update in sessions list
        setChatSessions(prev =>
            prev.map(session =>
                session.id === currentChat.id ? updatedChat : session
            )
        );

        // Add to history
        setChatHistory(prev => [...prev, message]);
    };

    // Function to load a chat from history
    const loadChat = (chatId) => {
        const chat = chatSessions.find(session => session.id === chatId);
        if (chat) {
            setCurrentChat(chat);
            navigate('/dashboard/chat');
        }
    };

    // Function to clear current chat
    const clearChat = () => {
        setCurrentChat(null);
    };

    // Context value to be shared across child components
    const contextValue = {
        chatHistory,
        currentChat,
        chatSessions,
        startNewChat,
        addMessage,
        loadChat,
        clearChat,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 text-gray-900 flex flex-col">
            <UserDashboardNavbar onNewChat={startNewChat} />
            <main className="flex-1 overflow-hidden pt-24">
                <UserChatContext.Provider value={contextValue}>
                    <Outlet />
                </UserChatContext.Provider>
            </main>
        </div>
    );
}

export default UserDashboardLayout;
