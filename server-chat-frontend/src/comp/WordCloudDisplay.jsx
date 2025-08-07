//WordCloudDisplay.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WordCloud from 'react-d3-cloud';

const WordcloudDisplay = () => {
  // Use the useParams hook to get the questionId from the URL
  const { questionId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Now questionId is correctly populated from the URL
    if (!questionId) {
      setLoading(false);
      return;
    }

    const fetchAndProcessAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/answers/${questionId}`, { headers });
        const answers = res.data;

        const frequencyMap = {};
        answers.forEach(answer => {
          const text = answer.text.toLowerCase().trim();
          frequencyMap[text] = (frequencyMap[text] || 0) + 1;
        });

        const wordCloudData = Object.entries(frequencyMap).map(([text, value]) => ({
          text,
          value,
        }));
        
        setData(wordCloudData);
      } catch (err) {
        console.error('Failed to fetch or process answers:', err);
        setError('Could not load word cloud data. Please check the question ID and your permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessAnswers();
  }, [questionId, headers]);

  const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;
  const rotate = (word) => (word.value % 2) * 90;

  if (loading) {
    return <div className="flex items-center justify-center h-64 p-6 bg-white rounded shadow-md">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 p-6 text-red-700 bg-red-100 rounded shadow-md">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-64 p-6 bg-white rounded shadow-md">No answers submitted yet.</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h3 className="mb-4 text-xl font-bold">Word Cloud Summary</h3>
      <div className="flex items-center justify-center h-64">
        <WordCloud
          data={data}
          fontSizeMapper={fontSizeMapper}
          rotate={rotate}
        />
      </div>
    </div>
  );
};

export default WordcloudDisplay;
