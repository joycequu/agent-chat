import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  const handleEvaluateClick = () => {
    navigate('/app');
  };

  const handleNewConversationClick = () => {
    // This can be implemented based on your requirements
    console.log('Starting new conversation');
  };

  return (
    <div className="start-page">
      <div className="button-container">
        <button 
          className="start-button"
          onClick={handleEvaluateClick}
        >
          Evaluate Conversations
        </button>
        
        <button 
          className="start-button"
          onClick={handleNewConversationClick}
        >
          Start New Conversation
        </button>
      </div>
    </div>
  );
};

export default StartPage;