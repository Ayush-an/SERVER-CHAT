//WordCloudComponent.jsx
import React from 'react';
import WordCloud from 'react-d3-cloud';

const WordCloudComponent = ({ data }) => {
  const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;
  const rotate = (word) => (word.value % 2) * 90;

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No answers submitted yet for this set.</div>;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <WordCloud
        data={data}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
        padding={10}
        font="Inter"
        fill="#4A5568"
      />
    </div>
  );
};

export default WordCloudComponent;