// Frontend (React) - App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./App.css";

axios.defaults.baseURL = 'http://localhost:3000';

const RatingCircles = ({ rating, setRating }) => {
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="rating-section">
      <h2 className="rating-label">Rate Agent Response: </h2>
      <div className="rating-circles">
        {ratings.map((value) => (
          <div key={value} className="rating-number">
            <div
              className={`circle ${rating === value ? 'selected' : ''}`}
              onClick={() => setRating(value)}
              role="button"
              aria-label={`Rate ${value}`}
            />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [chatData, setChatData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [ratings, setRatings] = useState([]);
  const [goalList, setGoalList] = useState([]);
  const [actionList, setActionList] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // Ref for scrolling
  const currentGoalRef = useRef(null);
  const currentChatRef = useRef(null);
  const currentActionRef = useRef(null);

  useEffect(() => {
    // Fetch initial chat data
    fetchChatData();
  }, []);

  useEffect(() => {
    // Scroll to the current task or chat when currentIndex changes
    if (currentGoalRef.current) {
      currentGoalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (currentActionRef.current) {
      currentActionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (currentChatRef.current) {
      currentChatRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  const fetchChatData = async () => {
    try {
      const response = await axios.get('/api/chat-data');
      console.log('Fetched data:', response.data);
      setChatData(response.data);
      if(response.data && response.data.length > 0){
        setGoalList([response.data[0].max_goal]);
        setChatHistory([response.data[0]]);
        setActionList([response.data[0].action_map]);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  const handleNext = () => {
    console.log('Next button clicked');
    // Save current rating
    try {
      console.log('Current Index:', currentIndex); // Debug log
      // Save current rating for the current chat pair
      setRatings (prevRatings => {
        const updatedRatings = [...prevRatings];
        updatedRatings[currentIndex] = rating;
        return updatedRatings;
      });
      // Move to next chat pair if available
      if (currentIndex < chatData.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setGoalList(prevGoals => [...prevGoals, chatData[nextIndex].max_goal]);
        setActionList(prevActions => [...prevActions, chatData[nextIndex].action_map]);
        setChatHistory((prevHistory) => [...prevHistory, chatData[nextIndex]]);
        setRating(5); // Reset rating to default value
      } else if (currentIndex === chatData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error handleNext:', error);
    }
  };

  const saveRatingsToFile = () => {
    // Prepare data for saving
    const dataToSave = chatData.map((chat, index) => ({
      chatIndex: index + 1, // Add an index for clarity
      max_goal: chat.max_goal,
      action_map: chat.action_map,
      userResponse: chat.userResponse,
      agentResponse: chat.agentResponse,
      rating: ratings[index] || -1, // Default to -1 if not rated
    }));
  
    // Convert data to JSON or CSV format
    const jsonString = JSON.stringify(dataToSave, null, 2); // For JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ratings.json'; // Filename for download
    link.click();
  };
  

  return (
    <div className="app-container">
      {/* Left Panel - Tasks */}
      <div className="column left">
        <div className="goal-container">
          <div className="box-header">Max Goal</div>
            <ul className="tasks-list">
              {goalList.map((max_goal, index) => (
                <li
                  key={index}
                  ref={index === currentIndex ? currentGoalRef : null}
                  className={index === currentIndex ? 'highlighted' : ''}>
                  {max_goal}
                </li>
              ))}
            </ul>
            {currentIndex >= chatData.length && (
              <div className="end-of-chat">
                <p><strong>End of Conversation</strong></p>
              </div>
            )}
        </div>
        <div className="action-container">
          <div className="box-header">Action Map</div>
            <ul className="tasks-list">
              {actionList.map((action_map, index) => (
                <li
                  key={index}
                  ref={index === currentIndex ? currentActionRef : null}
                  className={index === currentIndex ? 'highlighted' : ''}>
                  {action_map}
                </li>
              ))}
            </ul>
            {currentIndex >= chatData.length && (
              <div className="end-of-chat">
                <p><strong>End of Conversation</strong></p>
              </div>
            )}
        </div>
      </div>
  
      {/* Right Panel - Chat and Controls */}
      <div className="column right">
        {/* Chat Area */}
        <div className="chat-container">
          <div className="box-header">Conversation</div>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              ref={index === currentIndex ? currentChatRef : null}
              className={`chat-pair ${index === currentIndex ? 'highlighted' : ''}`}
            >
              <div className={'agent-message'}>
                <p><strong>Agent: </strong>{chat.agentResponse}</p>
              </div>
              <div className={'user-message'}>
                <p><strong>User: </strong>{chat.userResponse}</p>
              </div>
            </div>
          ))}
          {currentIndex >= chatData.length && (
            <div className="end-of-chat">
              <p><strong>End of Conversation</strong></p>
            </div>
          )}
        </div>
  
        {/* Controls */}
        <div className="controls-container">
          <div className="rating-controls">
            <RatingCircles rating={rating} setRating={setRating}/>
            {currentIndex < chatData.length ? ( // Show Next button if chats remain
              <button className="next-button" onClick={handleNext} disabled={currentIndex >= chatData.length}>Next</button>
            ) : ( // Show Save Scores button when no chats remain
              <button className="save-button" onClick={saveRatingsToFile}>Save Scores</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;