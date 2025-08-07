import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import WordCloudComponent from './WordCloudComponent.jsx';
import { ModalContext, NotificationContext } from './ModalAndNotification.jsx';
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;


const AdminDashboard = () => {
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [wordCloudData, setWordCloudData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openModal } = useContext(ModalContext);
  const { showNotification } = useContext(NotificationContext);

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all quiz sets when the component loads
  useEffect(() => {
    fetchSets();
  }, []);

  // Fetch questions and answers whenever a new set is selected
  useEffect(() => {
    if (selectedSet) {
      fetchQuestionsAndAnswersForSet(selectedSet);
    } else {
      // Clear data if no set is selected
      setQuestions([]);
      setAnswers([]);
      setWordCloudData([]);
    }
  }, [selectedSet]);

  // Fetches all available quiz sets from the backend
  const fetchSets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/sets`, { headers });
      setSets(res.data);
      console.log('Fetched sets:', res.data);
    } catch (error) {
      showNotification('Failed to fetch sets. Please check your network.', 'error');
      console.error('Fetch sets error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetches questions and answers for a specific set and generates the word cloud data
  const fetchQuestionsAndAnswersForSet = async (setId) => {
    console.log(`Starting data fetch for set ID: ${setId}`);
    try {
      setLoading(true);
      
      // 1. Fetch all questions for the selected set
      const questionsRes = await axios.get(`${API_BASE_URL}/api/admin/questions/set/${setId}`, { headers });
      const fetchedQuestions = questionsRes.data;
      setQuestions(fetchedQuestions);
      console.log('Step 1: Fetched questions:', fetchedQuestions);

      // Exit early if there are no questions
      if (fetchedQuestions.length === 0) {
        setAnswers([]);
        setWordCloudData([]);
        setLoading(false);
        showNotification('No questions found for this set.', 'info');
        console.log('Step 1: No questions found, exiting.');
        return;
      }
      
      // 2. Fetch all answers for each question in the set concurrently
      const answersPromises = fetchedQuestions.map(q => 
        axios.get(`${API_BASE_URL}/api/admin/answers/${q._id}`, { headers })
      );
      const answersResults = await Promise.all(answersPromises);

      // 3. Combine all answers into a single array
      let allAnswers = [];
      answersResults.forEach(res => {
        allAnswers = [...allAnswers, ...res.data];
      });
      setAnswers(allAnswers);
      console.log('Step 2: Combined answers:', allAnswers);

      // Exit early if there are no answers
      if (allAnswers.length === 0) {
        setWordCloudData([]);
        setLoading(false);
        showNotification('No answers submitted for this set yet.', 'info');
        console.log('Step 2: No answers found, exiting.');
        return;
      }

      // 4. Process the answers to create the word cloud data
      const frequencyMap = {};
      allAnswers.forEach(answer => {
        const text = answer.text.toLowerCase().trim();
        // Skip empty or trivial answers
        if (text && text.length > 2) { 
          frequencyMap[text] = (frequencyMap[text] || 0) + 1;
        }
      });

      const wordCloudData = Object.entries(frequencyMap).map(([text, value]) => ({
        text,
        value,
      }));
      setWordCloudData(wordCloudData);
      console.log('Step 3: Word cloud data:', wordCloudData);

    } catch (error) {
      showNotification('Failed to fetch data for this set. Check API endpoints.', 'error');
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSet = () => {
    let newSetTitle = '';
    openModal(
      'Create New Set',
      <input
        type="text"
        name="newSetTitle" 
        placeholder="Enter new set title"
        onChange={(e) => newSetTitle = e.target.value}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />,
      async () => {
        if (newSetTitle.trim()) {
          try {
            await axios.post(`${API_BASE_URL}/api/admin/set`, { title: newSetTitle }, { headers });
            showNotification('Set created successfully!', 'success');
            fetchSets();
          } catch (error) {
            showNotification('Failed to create set.', 'error');
          }
        }
      }
    );
  };

  const createQuestion = async (e) => {
    e.preventDefault();
    const questionText = e.target.elements.questionText.value;
    const questionType = e.target.elements.questionType.value;
    const options = questionType === 'MCQ'
      ? Array.from(e.target.elements.options).map(o => o.value).filter(o => o.trim() !== '')
      : [''];

    try {
      await axios.post(`${API_BASE_URL}/api/admin/question`, { 
        text: questionText, 
        type: questionType, 
        options,
        set: selectedSet
      }, { headers });
      showNotification('Question created successfully!', 'success');
      fetchQuestionsAndAnswersForSet(selectedSet);
    } catch (error) {
      showNotification('Failed to create question.', 'error');
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-gray-100">
      <div className="container mx-auto">
        <h1 className="mb-8 text-4xl font-extrabold text-center text-gray-800">Admin Dashboard</h1>

        {/* Set Management & Selection */}
        <div className="p-6 mb-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Manage Sets</h2>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <button onClick={createSet} className="w-full px-6 py-3 font-bold text-white transition-colors bg-green-500 rounded-lg shadow-md md:w-auto hover:bg-green-600">
              Create New Set
            </button>
            <label htmlFor="set-select" className="sr-only">Select a Set</label>
            <select
              id="set-select"
              name="set-select"
              onChange={(e) => setSelectedSet(e.target.value)}
              value={selectedSet}
              className="flex-grow p-3 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Set to manage...</option>
              {sets.map(set => (
                <option key={set._id} value={set._id}>{set.title}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedSet && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Question Creation */}
            <form onSubmit={createQuestion} className="h-full p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">Create Question</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="question-type" className="block mb-1 text-gray-600">Question Type:</label>
                  <select id="question-type" name="questionType" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="MCQ">MCQ</option>
                    <option value="QA">Question Answer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="question-text" className="block mb-1 text-gray-600">Question Text:</label>
                  <textarea
                    id="question-text"
                    name="questionText"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Options (for MCQ):</label>
                  <div className="space-y-2">
                    <input type="text" name="options" placeholder="Option 1" className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input type="text" name="options" placeholder="Option 2" className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input type="text" name="options" placeholder="Option 3" className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input type="text" name="options" placeholder="Option 4" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 font-bold text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Create Question
                </button>
              </div>
            </form>

            {/* Live Results Panel */}
            <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">Set Results</h2>
              {loading ? (
                <div className="text-center text-gray-500">Loading results...</div>
              ) : (
                <div className="h-full">
                  <h3 className="mb-2 text-xl font-semibold text-gray-700">Answers Word Cloud</h3>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl h-96">
                    {wordCloudData.length > 0 ? (
                      <WordCloudComponent data={wordCloudData} />
                    ) : (
                      <p className="text-gray-500">
                        No word cloud data to display. <br/>
                        Check the console for debugging info to see why.
                      </p>
                    )}
                  </div>
                  <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-700">All Submitted Answers</h3>
                  <div className="overflow-y-auto border border-gray-200 max-h-64 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Answer</th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {answers.length > 0 ? (
                          answers.map((answer) => (
                            <tr key={answer._id}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{answer.user?.name || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{answer.text}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(answer.submittedAt).toLocaleTimeString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-6 py-4 text-sm text-center text-gray-500">No answers yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
