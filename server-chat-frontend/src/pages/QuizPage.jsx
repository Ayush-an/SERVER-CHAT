import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { NotificationContext } from './ModalAndNotification';
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const QuizPage = () => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [submitted, setSubmitted] = useState(false);
  const userId = localStorage.getItem('userId');
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (question && !submitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            submitAnswer();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [question, submitted]);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/current-question`);
      setQuestion(res.data);
    } catch (error) {
      showNotification('No active question found!', 'error');
    }
  };

  const submitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!userId || !question || submitted) return;

    setSubmitted(true);
    try {
      await axios.post(`${API_BASE_URL}/api/user/submit`, {
        userId,
        questionId: question._id,
        text: answer,
      });
      showNotification('Answer submitted successfully!');
    } catch (error) {
      showNotification('Failed to submit answer.', 'error');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!question) return <div className="flex items-center justify-center min-h-screen font-sans bg-gray-100">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-sans bg-gray-100">
      <div className="w-full max-w-xl p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{question.text}</h2>
          <div className={`px-4 py-1 rounded-full text-white font-medium ${timeRemaining > 30 ? 'bg-blue-600' : 'bg-red-500'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
        <form onSubmit={submitAnswer}>
          {question.type === 'MCQ' ? (
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center p-4 transition-colors rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="mcq-options"
                    value={option}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={submitted}
                    className="w-5 h-5 mr-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={`option-${index}`} className="flex-grow text-lg text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Type your answer here..."
              disabled={submitted}
            />
          )}
          <button
            type="submit"
            className={`w-full p-4 mt-6 text-white font-bold rounded-lg shadow-md transition-all ${submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={submitted}
          >
            {submitted ? 'Answer Submitted' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizPage;